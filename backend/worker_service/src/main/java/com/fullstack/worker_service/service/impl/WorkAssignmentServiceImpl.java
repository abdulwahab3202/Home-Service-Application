package com.fullstack.worker_service.service.impl;

import com.fullstack.worker_service.client.BookingClient;
import com.fullstack.worker_service.client.UserClient;
import com.fullstack.worker_service.entity.WorkAssignment;
import com.fullstack.worker_service.entity.Worker;
import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.model.ResponseStatus;
import com.fullstack.worker_service.repository.WorkAssignmentRepository;
import com.fullstack.worker_service.repository.WorkerRepository;
import com.fullstack.worker_service.request.WorkAssignmentRequest;
import com.fullstack.worker_service.service.EmailService;
import com.fullstack.worker_service.service.IWorkAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class WorkAssignmentServiceImpl implements IWorkAssignmentService {

    @Autowired
    private WorkAssignmentRepository assignmentRepo;

    @Autowired
    private WorkerRepository workerRepo;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private EmailService emailService;

    @Override
    public CommonResponse acceptBooking(WorkAssignmentRequest req) {
        CommonResponse response = new CommonResponse();

        WorkAssignment activeAssignment = assignmentRepo.findByBookingId(req.getBookingId());
        if (activeAssignment != null && "ASSIGNED".equalsIgnoreCase(activeAssignment.getStatus())) {
            return buildError("Booking already assigned to a worker", HttpStatus.BAD_REQUEST);
        }

        Worker worker = workerRepo.getWorkerById(req.getWorkerId());
        if (worker == null) {
            return buildError("Worker not found", HttpStatus.NOT_FOUND);
        }

        if (worker.getCurrentBookingId() != null && !worker.getCurrentBookingId().isEmpty()) {
            return buildError("You already have an active job", HttpStatus.BAD_REQUEST);
        }

        List<WorkAssignment> workerHistory = assignmentRepo.findAssignmentsByWorkerId(req.getWorkerId());
        Optional<WorkAssignment> existingRecord = workerHistory.stream()
                .filter(a -> a.getBookingId().equals(req.getBookingId()))
                .findFirst();

        WorkAssignment assignment;

        if (existingRecord.isPresent()) {
            assignment = existingRecord.get();
            assignment.setStatus("ASSIGNED");
            assignment.setAssignedOn(new Date());
            assignment.setCreditPoints(100);
            assignment.setCompletionOtp(null);
            assignment.setCompletedOn(null);
        } else {
            assignment = new WorkAssignment();
            assignment.setWorkerId(req.getWorkerId());
            assignment.setBookingId(req.getBookingId());
            assignment.setStatus("ASSIGNED");
            assignment.setCreditPoints(100);
            assignment.setAssignedOn(new Date());
        }

        worker.setCurrentBookingId(req.getBookingId());
        worker.setAvailable(false);
        workerRepo.save(worker);

        assignmentRepo.save(assignment);

        try {
            bookingClient.updateBookingStatus(req.getBookingId(), "ASSIGNED");

            ResponseEntity<CommonResponse> bookingRes = bookingClient.getBookingById(req.getBookingId());
            if (bookingRes != null && bookingRes.getBody() != null && bookingRes.getBody().getData() != null) {
                Map<String, Object> bData = (Map<String, Object>) bookingRes.getBody().getData();
                String userId = (String) bData.get("userId");
                String title = (String) bData.get("title");
                String category = (String) bData.get("serviceCategory");

                if (userId != null) {
                    ResponseEntity<CommonResponse> userRes = userClient.getUserContactInfo(userId);
                    if (userRes != null && userRes.getBody() != null && userRes.getBody().getData() != null) {
                        Map<String, Object> contactData = (Map<String, Object>) userRes.getBody().getData();
                        String customerEmail = (String) contactData.get("email");
                        String customerName = (String) contactData.get("name");

                        String workerName = worker.getName();
                        String workerPhone = worker.getPhoneNumber();
                        String workerEmail = worker.getEmail();

                        if (customerEmail != null) {
                            emailService.sendAssignmentEmail(
                                    customerEmail,
                                    customerName,
                                    title,
                                    category,
                                    workerName,
                                    workerPhone,
                                    workerEmail
                            );
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed during Assignment Email Process: " + e.getMessage());
            e.printStackTrace();
        }

        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Booking Accepted");
        response.setData(assignment);
        response.setStatus(HttpStatus.CREATED);
        response.setStatusCode(HttpStatus.CREATED.value());
        return response;
    }

    @Override
    public CommonResponse revokeBooking(String assignmentId){
        CommonResponse response = new CommonResponse();
        Optional<WorkAssignment> assignmentOpt = Optional.ofNullable(assignmentRepo.findById(assignmentId));
        if (assignmentOpt.isEmpty()) {
            return buildError("Assignment not found", HttpStatus.NOT_FOUND);
        }
        WorkAssignment assignment = assignmentOpt.get();

        assignment.setStatus("OPEN");

        Worker worker = workerRepo.getWorkerById(assignment.getWorkerId());
        worker.setCurrentBookingId(null);
        worker.setAvailable(true);
        workerRepo.save(worker);

        try {
            bookingClient.updateBookingStatus(assignment.getBookingId(), "OPEN");

            ResponseEntity<CommonResponse> bookingRes = bookingClient.getBookingById(assignment.getBookingId());
            if (bookingRes != null && bookingRes.getBody() != null && bookingRes.getBody().getData() != null) {
                Map<String, Object> bData = (Map<String, Object>) bookingRes.getBody().getData();
                String userId = (String) bData.get("userId");
                String title = (String) bData.get("title");
                String category = (String) bData.get("serviceCategory");

                if (userId != null) {
                    ResponseEntity<CommonResponse> userRes = userClient.getUserContactInfo(userId);
                    if (userRes != null && userRes.getBody() != null && userRes.getBody().getData() != null) {
                        Map<String, Object> contactData = (Map<String, Object>) userRes.getBody().getData();
                        String customerEmail = (String) contactData.get("email");
                        String customerName = (String) contactData.get("name");

                        if (customerEmail != null) {
                            emailService.sendRevocationEmail(customerEmail, customerName, title, category);
                        }
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Error during revocation process: " + e.getMessage());
        }

        assignmentRepo.save(assignment);

        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setStatus(HttpStatus.OK);
        response.setMessage("Assignment revoked successfully");
        response.setData(assignment);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse generateOtpForCompletion(String assignmentId) {
        CommonResponse response = new CommonResponse();
        Optional<WorkAssignment> assignmentOpt = Optional.ofNullable(assignmentRepo.findById(assignmentId));
        if (assignmentOpt.isEmpty()) return buildError("Assignment not found", HttpStatus.NOT_FOUND);
        WorkAssignment assignment = assignmentOpt.get();
        String otp = String.valueOf((int) (Math.random() * 9000) + 1000);
        assignment.setCompletionOtp(otp);
        assignmentRepo.save(assignment);
        try {
            String customerEmail = fetchCustomerEmail(assignment.getBookingId());
            if (customerEmail != null) {
                emailService.sendOtpEmail(customerEmail, otp);
                response.setMessage("OTP sent to customer email.");
                response.setResponseStatus(ResponseStatus.SUCCESS);
                response.setStatus(HttpStatus.OK);
                response.setStatusCode(HttpStatus.OK.value());
            } else {
                return buildError("Could not find customer email linked to booking.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            System.err.println("Email failed: " + e.getMessage());
            response.setMessage("OTP Generated but Email Failed: " + e.getMessage());
            response.setResponseStatus(ResponseStatus.SUCCESS);
            response.setStatus(HttpStatus.OK);
            response.setStatusCode(HttpStatus.OK.value());
        }
        return response;
    }

    @Override
    public CommonResponse updateStatus(String assignmentId, String status, String otpInput) {
        CommonResponse response = new CommonResponse();
        Optional<WorkAssignment> assignmentOpt = Optional.ofNullable(assignmentRepo.findById(assignmentId));
        if (assignmentOpt.isEmpty()) return buildError("Assignment not found", HttpStatus.NOT_FOUND);
        WorkAssignment assignment = assignmentOpt.get();

        if ("COMPLETED".equalsIgnoreCase(status)) {
            if (otpInput == null || otpInput.isEmpty()) return buildError("OTP is required to complete the job.", HttpStatus.BAD_REQUEST);
            if (assignment.getCompletionOtp() == null || !assignment.getCompletionOtp().equals(otpInput)) {
                return buildError("Invalid OTP. Please ask the customer for the correct code.", HttpStatus.UNAUTHORIZED);
            }
            assignment.setCompletionOtp(null);
        }

        assignment.setStatus(status);

        try {
            bookingClient.updateBookingStatus(assignment.getBookingId(), status);
        } catch (Exception e) {
            System.err.println("Error updating booking status via Feign: " + e.getMessage());
        }

        Map<String, String> responseData = new HashMap<>();

        if ("COMPLETED".equalsIgnoreCase(status)) {
            assignment.setCompletedOn(new Date());
            Worker worker = workerRepo.getWorkerById(assignment.getWorkerId());
            if (worker != null) {
                worker.setTotalCredits(worker.getTotalCredits() + assignment.getCreditPoints());
                worker.setCurrentBookingId(null);
                worker.setAvailable(true);
                workerRepo.save(worker);
            }
        }

        assignmentRepo.save(assignment);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Status Updated");
        response.setData(responseData);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse getAssignmentsByWorker(String workerId) {
        return new CommonResponse(HttpStatus.OK, ResponseStatus.SUCCESS, "Success", assignmentRepo.findAssignmentsByWorkerId(workerId), 200);
    }

    @Override
    public CommonResponse getAllAssignments() {
        return new CommonResponse(HttpStatus.OK, ResponseStatus.SUCCESS, "Success", assignmentRepo.findAll(), 200);
    }

    @Override
    public CommonResponse getAssignmentById(String id) {
        Optional<WorkAssignment> wa = Optional.ofNullable(assignmentRepo.findById(id));
        return wa.map(workAssignment -> new CommonResponse(HttpStatus.OK, ResponseStatus.SUCCESS, "Success", workAssignment, 200))
                .orElseGet(() -> new CommonResponse(HttpStatus.NOT_FOUND, ResponseStatus.FAILED, "Not Found", null, 404));
    }

    private String fetchCustomerEmail(String bookingId) {
        try {
            ResponseEntity<CommonResponse> bookingRes = bookingClient.getBookingById(bookingId);
            if (bookingRes != null && bookingRes.getBody() != null && bookingRes.getBody().getData() != null) {
                Map<String, Object> bData = (Map<String, Object>) bookingRes.getBody().getData();
                String userId = (String) bData.get("userId");
                if (userId != null) {
                    ResponseEntity<CommonResponse> userRes = userClient.getUserContactInfo(userId);
                    if (userRes != null && userRes.getBody() != null && userRes.getBody().getData() != null) {
                        Map<String, Object> contactData = (Map<String, Object>) userRes.getBody().getData();
                        return (String) contactData.get("email");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching customer email: " + e.getMessage());
        }
        return null;
    }

    private CommonResponse buildError(String msg, HttpStatus status) {
        CommonResponse res = new CommonResponse();
        res.setResponseStatus(ResponseStatus.FAILED);
        res.setMessage(msg);
        res.setStatus(status);
        res.setStatusCode(status.value());
        return res;
    }
}