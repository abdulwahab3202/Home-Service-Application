package com.fullstack.booking_service.client;

import com.fullstack.booking_service.model.CommonResponse;
import com.fullstack.booking_service.request.JobNotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "worker-service", path = "/api/wms")
public interface WorkerClient {

    @PostMapping("/worker/notify-new-job")
    ResponseEntity<CommonResponse> notifyWorkers(@RequestBody JobNotificationRequest request);
}