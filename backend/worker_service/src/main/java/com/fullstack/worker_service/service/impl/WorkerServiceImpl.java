package com.fullstack.worker_service.service.impl;

import com.fullstack.worker_service.client.BookingClient;
import com.fullstack.worker_service.client.UserClient;
import com.fullstack.worker_service.entity.Worker;
import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.model.ResponseStatus;
import com.fullstack.worker_service.repository.WorkerRepository;
import com.fullstack.worker_service.request.WorkerRequest;
import com.fullstack.worker_service.service.EmailService;
import com.fullstack.worker_service.service.IWorkerService;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class WorkerServiceImpl implements IWorkerService {

    private static final Logger logger = LoggerFactory.getLogger(WorkerServiceImpl.class);

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private EmailService emailService;

    @Override
    public CommonResponse createWorkerProfile(WorkerRequest workerRequest){
        CommonResponse response = new CommonResponse();
        Worker worker = new Worker();
        worker.setWorkerId(workerRequest.getUserId());
        worker.setName(workerRequest.getName());
        worker.setEmail(workerRequest.getEmail());
        worker.setPhoneNumber(workerRequest.getPhoneNumber());
        worker.setDepartment(workerRequest.getDepartment());
        worker.setDistrict(workerRequest.getDistrict());
        worker.setTaluka(workerRequest.getTaluka());
        worker.setCreatedOn(new Date());
        worker.setUpdatedOn(new Date());
        worker.setAvailable(true);
        worker.setTotalCredits(0);
        workerRepository.save(worker);
        response.setMessage("Worker Profile Created Successfully");
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setData(worker);
        response.setStatus(HttpStatus.CREATED);
        response.setStatusCode(HttpStatus.CREATED.value());
        return response;
    }

    @Override
    public CommonResponse sendRegistrationEmail(String email, String otp) {
        emailService.sendRegistrationOtp(email, otp);
        CommonResponse response = new CommonResponse();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("OTP Sent");
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(200);
        return response;
    }

    @Override
    public CommonResponse getAssignedBooking(HttpServletRequest request){
        CommonResponse response = new CommonResponse();
        Claims userClaims = (Claims) request.getAttribute("userClaims");
        Optional<Worker> workerOpt = Optional.ofNullable(workerRepository.getWorkerById(userClaims.get("userId", String.class)));
        if(workerOpt.isEmpty()){
            response.setStatus(HttpStatus.NOT_FOUND);
            response.setResponseStatus(ResponseStatus.FAILED);
            response.setMessage("Worker not found");
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            return response;
        }
        Worker worker = workerOpt.get();
        String bookingId = worker.getCurrentBookingId();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Current Booking ID");
        response.setData(bookingId);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse getAvailableBookings(HttpServletRequest request) {

        try {
            Claims claims = (Claims) request.getAttribute("userClaims");
            if (claims == null) {
                return new CommonResponse(HttpStatus.UNAUTHORIZED, ResponseStatus.FAILED, "Invalid Token Claims", null, 401);
            }

            String workerId = claims.get("userId", String.class);

            Worker worker = workerRepository.getWorkerById(workerId);

            if (worker == null) {
                return new CommonResponse(HttpStatus.NOT_FOUND, ResponseStatus.FAILED, "Worker Profile Not Found", null, 404);
            }

            String category = worker.getDepartment();
            String taluka = worker.getTaluka();
            if (category == null || category.isEmpty()) {
                return new CommonResponse(HttpStatus.BAD_REQUEST, ResponseStatus.FAILED, "Worker Department is missing", null, 400);
            }
            if (taluka == null || taluka.isEmpty()) {
                return new CommonResponse(HttpStatus.OK, ResponseStatus.SUCCESS, "No location set for worker", List.of(), 200);
            }

            ResponseEntity<CommonResponse> responseEntity = bookingClient.getBookingsForWorker(category, taluka);

            if (responseEntity == null) {
                return new CommonResponse(HttpStatus.INTERNAL_SERVER_ERROR, ResponseStatus.FAILED, "Booking Service Unavailable", null, 500);
            }


            CommonResponse body = responseEntity.getBody();

            return body;

        } catch (Exception e) {
            return new CommonResponse(HttpStatus.INTERNAL_SERVER_ERROR, ResponseStatus.FAILED, "Internal Server Error: " + e.getMessage(), null, 500);
        }
    }

    @Override
    public CommonResponse getAllWorkers() {
        List<Worker> workers = workerRepository.getAllWorkers();
        CommonResponse response = new CommonResponse();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Workers Retrieved Successfully");
        response.setData(workers);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse getWorkerById(String id) {
        Worker worker = workerRepository.getWorkerById(id);
        if (worker == null) {
            return new CommonResponse(HttpStatus.NOT_FOUND, ResponseStatus.FAILED, "Worker Not Found", null, 404);
        }
        try {
            ResponseEntity<CommonResponse> userRes = userClient.getUserContactInfo(id);
            if (userRes != null && userRes.getBody() != null && userRes.getBody().getData() != null) {
                Map<String, Object> userData = (Map<String, Object>) userRes.getBody().getData();
                worker.setName((String) userData.get("name"));
                worker.setEmail((String) userData.get("email"));
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch user Name/Email: " + e.getMessage());
        }
        CommonResponse response = new CommonResponse();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Worker Retrieved Successfully");
        response.setData(worker);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse deleteWorker(String id) {
        CommonResponse response = new CommonResponse();
        if(workerRepository.getWorkerById(id) == null){
            response.setResponseStatus(ResponseStatus.FAILED);
            response.setMessage("Worker Not Found");
            response.setStatus(HttpStatus.NOT_FOUND);
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
        }
        workerRepository.deleteWorkerById(id);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Worker Deleted Successfully");
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse findAvailableWorkers() {
        List<Worker> workers = workerRepository.findAvailableWorkers();
        CommonResponse response = new CommonResponse();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Workers Retrieved Successfully");
        response.setData(workers);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse updateWorker(String id, WorkerRequest req) {
        CommonResponse response = new CommonResponse();
        Worker worker = workerRepository.getWorkerById(id);
        if(worker == null){
            response.setResponseStatus(ResponseStatus.FAILED);
            response.setMessage("Worker Not Found");
            response.setStatus(HttpStatus.NOT_FOUND);
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            return response;
        }
        if(req.getName() != null) worker.setName(req.getName());
        if(req.getPhoneNumber() != null) worker.setPhoneNumber(req.getPhoneNumber());
        if(req.getDepartment() != null) worker.setDepartment(req.getDepartment());
        workerRepository.save(worker);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Worker Updated Successfully");
        response.setData(worker);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }
}