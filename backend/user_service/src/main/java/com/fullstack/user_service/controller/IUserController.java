package com.fullstack.user_service.controller;

import com.fullstack.user_service.model.CommonResponse;
import com.fullstack.user_service.request.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

public interface IUserController {

    @PostMapping("/register")
    ResponseEntity<CommonResponse> register(@RequestBody UserRequest userRequest);

    @PostMapping("/login")
    ResponseEntity<CommonResponse> login(@RequestBody UserRequest userRequest);

    @PostMapping("/auth/google")
    ResponseEntity<CommonResponse> googleLogin(@RequestBody Map<String, String> payload);

    @GetMapping("/get-all")
    ResponseEntity<CommonResponse> getAllUsers();

    @GetMapping("/get-all-customers")
    ResponseEntity<CommonResponse> getAllCustomers();

    @GetMapping("/get/{userId}")
    ResponseEntity<CommonResponse> getUserById(@PathVariable String userId);

    @GetMapping("/contact-info/{userId}")
    ResponseEntity<CommonResponse> getUserContactInfo(@PathVariable String userId);

    @PutMapping("/update")
    ResponseEntity<CommonResponse> updateUser(HttpServletRequest request, @RequestBody UserRequest userRequest);

    @DeleteMapping("/delete/{userId}")
    ResponseEntity<CommonResponse> deleteUser(@PathVariable String userId);
}