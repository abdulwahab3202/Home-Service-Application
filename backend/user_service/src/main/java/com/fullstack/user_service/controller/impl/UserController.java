package com.fullstack.user_service.controller.impl;

import com.fullstack.user_service.controller.IUserController;
import com.fullstack.user_service.model.CommonResponse;
import com.fullstack.user_service.request.UserRequest;
import com.fullstack.user_service.service.IUserService;
import com.fullstack.user_service.model.ResponseStatus;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("user")
@CrossOrigin("*")
@RestController
public class UserController implements IUserController {

    @Autowired
    private IUserService userService;

    @Override
    public ResponseEntity<CommonResponse> register(UserRequest userRequest) {
        try {
            CommonResponse response = userService.register(userRequest);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Register");
        }
    }

    @Override
    public ResponseEntity<CommonResponse> login(UserRequest userRequest) {
        try {
            CommonResponse response = userService.login(userRequest);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Login");
        }
    }

    @Override
    public ResponseEntity<CommonResponse> googleLogin(Map<String, String> payload) {
        String token = payload.get("token");
        try {
            CommonResponse response = userService.handleGoogleLogin(token);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Google Login");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> getAllUsers() {
        try {
            CommonResponse response = userService.getAllUsers();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get All Users");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> getAllCustomers() {
        try {
            CommonResponse response = userService.getAllCustomers();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get All Customers");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','WORKER','CUSTOMER')")
    public ResponseEntity<CommonResponse> getUserById(String userId) {
        try {
            CommonResponse response = userService.getUserById(userId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get User By Id");
        }
    }

    @Override
    public ResponseEntity<CommonResponse> getUserContactInfo(String userId) {
        try {
            CommonResponse response = userService.getUserContactInfo(userId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get User Info");
        }
    }

    @Override
    public ResponseEntity<CommonResponse> updateUser(HttpServletRequest request, UserRequest userRequest) {
        try {
            CommonResponse response = userService.updateUser(request,userRequest);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Update User");
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> deleteUser(String userId) {
        try {
            CommonResponse response = userService.deleteUser(userId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Delete User");
        }
    }

    public ResponseEntity<CommonResponse> exceptionHandler(Exception ex, String contextMessage) {
        CommonResponse response = new CommonResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setResponseStatus(ResponseStatus.FAILED);
        response.setMessage("Internal Server Error: " + contextMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}