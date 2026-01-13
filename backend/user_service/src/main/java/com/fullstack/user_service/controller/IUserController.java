package com.fullstack.user_service.controller;

import com.fullstack.user_service.model.CommonResponse;
import com.fullstack.user_service.request.ChangePasswordRequest;
import com.fullstack.user_service.request.ResetPasswordRequest;
import com.fullstack.user_service.request.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

public interface IUserController {

    @PostMapping("/auth/send-otp")
    ResponseEntity<CommonResponse> sendOtp(@RequestParam String email);

    @PostMapping("/auth/send-reset-otp")
    ResponseEntity<CommonResponse> sendResetOtp(@RequestParam String email);

    @PostMapping("/auth/verify-otp")
    ResponseEntity<CommonResponse> verifyOtp(@RequestParam String email, @RequestParam String otp);

    @PostMapping("/auth/google")
    ResponseEntity<CommonResponse> googleLogin(@RequestBody Map<String, String> payload);

    @PostMapping("/auth/reset-password")
    ResponseEntity<CommonResponse> resetPassword(@RequestBody ResetPasswordRequest request);

    @PostMapping("/register")
    ResponseEntity<CommonResponse> register(@RequestBody UserRequest userRequest);

    @PostMapping("/login")
    ResponseEntity<CommonResponse> login(@RequestBody UserRequest userRequest);

    @GetMapping("/get-all")
    ResponseEntity<CommonResponse> getAllUsers();

    @GetMapping("/get-all-customers")
    ResponseEntity<CommonResponse> getAllCustomers();

    @GetMapping("/get/{userId}")
    ResponseEntity<CommonResponse> getUserById(@PathVariable String userId);

    @GetMapping("/contact-info/{userId}")
    ResponseEntity<CommonResponse> getUserContactInfo(@PathVariable String userId);

    @PutMapping("/change-password")
    ResponseEntity<CommonResponse> changePassword(HttpServletRequest request, @RequestBody ChangePasswordRequest changePasswordRequest);

    @PutMapping("/update")
    ResponseEntity<CommonResponse> updateUser(HttpServletRequest request, @RequestBody UserRequest userRequest);

    @DeleteMapping("/delete/{userId}")
    ResponseEntity<CommonResponse> deleteUser(@PathVariable String userId);
}