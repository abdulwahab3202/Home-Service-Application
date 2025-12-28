package com.fullstack.user_service.client;

import com.fullstack.user_service.model.CommonResponse;
import com.fullstack.user_service.request.WorkerRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "worker-service", path = "/api/wms")
public interface WorkerClient {

    @PostMapping("/worker/create")
    CommonResponse createWorkerProfile(@RequestBody WorkerRequest workerRequest);

    @GetMapping("/worker/get/{workerId}")
    CommonResponse getWorkerById(@PathVariable("workerId") String workerId);

    @PutMapping("/worker/update/{workerId}")
    CommonResponse updateWorkerProfile(@PathVariable("workerId") String workerId, @RequestBody WorkerRequest workerRequest);

    @DeleteMapping("/worker/delete/{workerId}")
    CommonResponse deleteWorkerProfile(@PathVariable("workerId") String workerId);
}