package com.fullstack.worker_service.client;

import com.fullstack.worker_service.model.CommonResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", path = "/api/user")
public interface UserClient {

    @GetMapping("/get/{userId}")
    ResponseEntity<CommonResponse> getUserById(@PathVariable("userId") String userId);

    @GetMapping("/contact-info/{userId}")
    ResponseEntity<CommonResponse> getUserContactInfo(@PathVariable("userId") String userId);
}