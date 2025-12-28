package com.fullstack.worker_service.controller;

import com.fullstack.worker_service.model.CommonResponse;
import com.fullstack.worker_service.request.WorkerRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface IWorkerController {

    @PostMapping("/create")
    ResponseEntity<CommonResponse> createWorkerProfile(@RequestBody WorkerRequest workerRequest);

    @GetMapping("get-all")
    ResponseEntity<CommonResponse> getAllWorkers();

    @GetMapping("/get/{workerId}")
    ResponseEntity<CommonResponse> getWorkerById(@PathVariable String workerId);

    @GetMapping("/get/assigned-complaint")
    ResponseEntity<CommonResponse> getAssignedBooking(HttpServletRequest request);

    @PutMapping("/update/{workerId}")
    ResponseEntity<CommonResponse> updateWorker(@PathVariable String workerId, @RequestBody WorkerRequest request);

    @DeleteMapping("/delete/{workerId}")
    ResponseEntity<CommonResponse> deleteWorker(@PathVariable String workerId);

    @GetMapping("/available")
    ResponseEntity<CommonResponse> findAvailableWorkers();

    @GetMapping("/get-all-complaints")
    ResponseEntity<CommonResponse> getAvailableBookings(HttpServletRequest request);
}