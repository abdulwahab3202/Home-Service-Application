package com.fullstack.worker_service.client;

import com.fullstack.worker_service.model.CommonResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "booking-service", path = "/api/bms")
public interface BookingClient {

    @GetMapping("/booking/get-by-category")
    ResponseEntity<CommonResponse> getBookingsByCategory(@RequestParam("category") String category);

    @PutMapping("/booking/update-status/{id}")
    void updateBookingStatus(@PathVariable("id") String id,
                             @RequestParam("status") String status);

    @GetMapping("/booking/get/{id}")
    ResponseEntity<CommonResponse> getBookingById(@PathVariable("id") String id);

    @GetMapping("/booking/filter")
    ResponseEntity<CommonResponse> getBookingsForWorker(
            @RequestParam("category") String category,
            @RequestParam("taluka") String taluka
    );
}