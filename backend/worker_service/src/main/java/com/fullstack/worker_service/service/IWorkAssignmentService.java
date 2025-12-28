package com.fullstack.worker_service.service;

import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.request.WorkAssignmentRequest;

public interface IWorkAssignmentService {

    CommonResponse acceptBooking(WorkAssignmentRequest request);

    CommonResponse revokeBooking(String assignmentId);

    CommonResponse generateOtpForCompletion(String assignmentId);

    CommonResponse updateStatus(String assignmentId, String status, String otp);

    CommonResponse getAssignmentsByWorker(String workerId);

    CommonResponse getAllAssignments();

    CommonResponse getAssignmentById(String assignmentId);
}