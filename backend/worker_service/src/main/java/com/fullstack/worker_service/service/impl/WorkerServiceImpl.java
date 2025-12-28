package com.fullstack.worker_service.service.impl;

import com.fullstack.worker_service.client.BookingClient;
import com.fullstack.worker_service.entity.Worker;
import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.model.ResponseStatus;
import com.fullstack.worker_service.repository.WorkerRepository;
import com.fullstack.worker_service.request.WorkerRequest;
import com.fullstack.worker_service.service.IWorkerService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WorkerServiceImpl implements IWorkerService {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private BookingClient bookingClient;

    @Override
    public CommonResponse createWorkerProfile(WorkerRequest workerRequest){
        CommonResponse response = new CommonResponse();
        Worker worker = new Worker();
        worker.setWorkerId(workerRequest.getUserId());
        worker.setName(workerRequest.getName());
        worker.setEmail(workerRequest.getEmail());
        worker.setPhoneNumber(workerRequest.getPhoneNumber());
        worker.setDepartment(workerRequest.getDepartment());
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
    public CommonResponse getAvailableBookings(HttpServletRequest request){
        Claims claims = (Claims) request.getAttribute("userClaims");
        String workerId = claims.get("userId", String.class);
        Worker worker = workerRepository.getWorkerById(workerId);
        String category = worker.getDepartment();
        ResponseEntity<CommonResponse> response = bookingClient.getBookingsByCategory(category);
        return response.getBody();
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