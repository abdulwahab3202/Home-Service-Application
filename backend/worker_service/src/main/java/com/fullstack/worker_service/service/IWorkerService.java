package com.fullstack.worker_service.service;

import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.request.JobNotificationRequest;
import com.fullstack.worker_service.request.WorkerRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface IWorkerService {

    CommonResponse createWorkerProfile(WorkerRequest workerRequest);

    CommonResponse sendRegistrationEmail(String email, String otp);

    CommonResponse getAllWorkers();

    CommonResponse getWorkerById(String workerId);

    CommonResponse getAssignedBooking(HttpServletRequest request);

    CommonResponse updateWorker(String workerId, WorkerRequest request);

    CommonResponse deleteWorker(String workerId);

    CommonResponse findAvailableWorkers();

    CommonResponse notifyWorkersOfNewJob(JobNotificationRequest request);

    CommonResponse getAvailableBookings(HttpServletRequest request);
}