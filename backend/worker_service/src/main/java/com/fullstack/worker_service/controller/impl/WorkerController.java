package com.fullstack.worker_service.controller.impl;

import com.fullstack.worker_service.controller.IWorkerController;
import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.model.ResponseStatus;
import com.fullstack.worker_service.request.WorkerRequest;
import com.fullstack.worker_service.service.IWorkerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequestMapping("worker")
@RestController
public class WorkerController implements IWorkerController {

    @Autowired
    private IWorkerService workerService;

    @Override
    public ResponseEntity<CommonResponse> createWorkerProfile(WorkerRequest workerRequest) {
        try {
            CommonResponse response = workerService.createWorkerProfile(workerRequest);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get Workers");
        }
    }

    @Override
    public ResponseEntity<CommonResponse> sendRegistrationOtp(String email, String otp) {
        try {
            CommonResponse response = workerService.sendRegistrationEmail(email,otp);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Send Registration Otp");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> getAllWorkers() {
        try {
            CommonResponse response = workerService.getAllWorkers();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get Workers");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    public ResponseEntity<CommonResponse> getWorkerById(String workerId) {
        try {
            CommonResponse response = workerService.getWorkerById(workerId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get Worker By Id");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    public ResponseEntity<CommonResponse> getAssignedBooking(HttpServletRequest request) {
        try {
            CommonResponse response = workerService.getAssignedBooking(request);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get Assigned Complaint");
        }
    }

    @Override
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<CommonResponse> updateWorker(String workerId, WorkerRequest request) {
        try {
            CommonResponse response = workerService.updateWorker(workerId, request);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Update Worker");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> deleteWorker(String workerId) {
        try {
            CommonResponse response = workerService.deleteWorker(workerId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Delete Worker");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> findAvailableWorkers() {
        try {
            CommonResponse response = workerService.findAvailableWorkers();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Find Available Workers");
        }
    }

    @Override
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<CommonResponse> getAvailableBookings(HttpServletRequest request) {
        try {
            CommonResponse response = workerService.getAvailableBookings(request);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get All Complaints");
        }
    }

    public ResponseEntity<CommonResponse> exceptionHandler(Exception ex, String contextMessage) {
        CommonResponse response = new CommonResponse();
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        response.setResponseStatus(ResponseStatus.FAILED);
        response.setMessage("Internal Server Error at " + contextMessage);
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}