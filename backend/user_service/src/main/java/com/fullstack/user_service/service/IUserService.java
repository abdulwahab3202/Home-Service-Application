package com.fullstack.user_service.service;

import com.fullstack.user_service.model.CommonResponse;
import com.fullstack.user_service.request.UserRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface IUserService {

    CommonResponse register(UserRequest userRequest);

    CommonResponse sendVerificationOtp(String email);

    CommonResponse verifyOtp(String email, String otp);

    CommonResponse login(UserRequest userRequest);

    CommonResponse handleGoogleLogin(String idToken);

    CommonResponse getAllUsers();

    CommonResponse getAllCustomers();

    CommonResponse getUserById(String userId);

    CommonResponse getUserContactInfo(String userId);

    CommonResponse updateUser(HttpServletRequest request, UserRequest userRequest);

    CommonResponse deleteUser(String userId);
}