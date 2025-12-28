package com.fullstack.worker_service.controller.impl;

import com.fullstack.worker_service.controller.IWorkAssignmentController;
import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.model.ResponseStatus;
import com.fullstack.worker_service.request.WorkAssignmentRequest;
import com.fullstack.worker_service.service.IWorkAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("work-assignment")
public class WorkAssignmentController implements IWorkAssignmentController {

    @Autowired
    private IWorkAssignmentService workAssignmentService;

    @Override
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<CommonResponse> acceptBooking(WorkAssignmentRequest request) {
        try {
            CommonResponse response = workAssignmentService.acceptBooking(request);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Accept Booking");
        }
    }

    @Override
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<CommonResponse> revokeBooking(String assignmentId) {
        try {
            CommonResponse response = workAssignmentService.revokeBooking(assignmentId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Revoke Booking");
        }
    }

    @Override
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<CommonResponse> generateCompletionOtp(String assignmentId) {
        try {
            CommonResponse response = workAssignmentService.generateOtpForCompletion(assignmentId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Generate OTP");
        }
    }

    @Override
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<CommonResponse> updateStatus(String assignmentId, String status, String otp) {
        try {
            CommonResponse response = workAssignmentService.updateStatus(assignmentId,status,otp);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Update Status");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
    public ResponseEntity<CommonResponse> getAssignmentsByWorker(String workerId) {
        try {
            CommonResponse response = workAssignmentService.getAssignmentsByWorker(workerId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get Assignments By Worker");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> getAllAssignments() {
        try {
            CommonResponse response = workAssignmentService.getAllAssignments();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get All Assignments");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> getAssignmentById(String assignmentId) {
        try {
            CommonResponse response = workAssignmentService.getAssignmentById(assignmentId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get Assignment By Id");
        }
    }

    private ResponseEntity<CommonResponse> exceptionHandler(Exception e, String operation) {
        CommonResponse response = new CommonResponse();
        response.setResponseStatus(ResponseStatus.FAILED);
        response.setMessage(operation + " Failed: " + e.getMessage());
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}