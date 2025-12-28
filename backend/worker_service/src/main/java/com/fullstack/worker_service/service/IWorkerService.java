package com.fullstack.worker_service.service;

import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.request.WorkerRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface IWorkerService {

    CommonResponse createWorkerProfile(WorkerRequest workerRequest);

    CommonResponse getAllWorkers();

    CommonResponse getWorkerById(String workerId);

    CommonResponse getAssignedBooking(HttpServletRequest request);

    CommonResponse updateWorker(String workerId, WorkerRequest request);

    CommonResponse deleteWorker(String workerId);

    CommonResponse findAvailableWorkers();

    CommonResponse getAvailableBookings(HttpServletRequest request);
}