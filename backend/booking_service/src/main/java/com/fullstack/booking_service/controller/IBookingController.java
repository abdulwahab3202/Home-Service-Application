package com.fullstack.booking_service.controller;

import com.fullstack.booking_service.model.CommonResponse;
import com.fullstack.booking_service.request.UpdateBookingRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

public interface IBookingController {

    @PostMapping("/create")
    ResponseEntity<CommonResponse> createBooking(
            HttpServletRequest request,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("serviceCategory") String serviceCategory,
            @RequestParam("address") String address,
            @RequestPart("image") MultipartFile image
    );

    @GetMapping("/get-all")
    ResponseEntity<CommonResponse> getAllBookings();

    @GetMapping("/bookings/filter")
    ResponseEntity<CommonResponse> getBookingsForWorker(@RequestParam String category, @RequestParam String taluka);

    @GetMapping("/get-by-category")
    ResponseEntity<CommonResponse> getBookingsByCategory(@RequestParam(value="category") String category);

    @GetMapping("/get/{id}")
    ResponseEntity<CommonResponse> getBookingById(@PathVariable String id);

    @GetMapping("/user/{userId}")
    ResponseEntity<CommonResponse> getBookingsByUserId(@PathVariable String userId);

    @PutMapping("/update/{id}")
    ResponseEntity<CommonResponse> updateBooking(@PathVariable String id, @RequestBody UpdateBookingRequest request);

    @PutMapping("/update-status/{id}")
    ResponseEntity<CommonResponse> updateBookingStatus(@PathVariable String id, @RequestParam String status, @RequestParam(required = false) String reason);

    @DeleteMapping("/delete/{id}")
    ResponseEntity<CommonResponse> deleteBooking(@PathVariable String id);
}