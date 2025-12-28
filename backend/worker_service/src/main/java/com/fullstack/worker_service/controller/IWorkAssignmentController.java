package com.fullstack.worker_service.controller;

import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.request.WorkAssignmentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface IWorkAssignmentController {

    @PostMapping("/accept")
    ResponseEntity<CommonResponse> acceptBooking(@RequestBody WorkAssignmentRequest request);

    @PutMapping("/revoke/{assignmentId}")
    ResponseEntity<CommonResponse> revokeBooking(@PathVariable String assignmentId);

    @PostMapping("/generate-otp/{assignmentId}")
    ResponseEntity<CommonResponse> generateCompletionOtp(@PathVariable String assignmentId);

    @PutMapping("/status/{assignmentId}")
    ResponseEntity<CommonResponse> updateStatus(@PathVariable String assignmentId,
                                                @RequestParam String status,
                                                @RequestParam(required = false) String otp);

    @GetMapping("/worker/{workerId}")
    ResponseEntity<CommonResponse> getAssignmentsByWorker(@PathVariable String workerId);

    @GetMapping("/get-all-assignments")
    ResponseEntity<CommonResponse> getAllAssignments();

    @GetMapping("/get/{assignmentId}")
    ResponseEntity<CommonResponse> getAssignmentById(@PathVariable String assignmentId);

}