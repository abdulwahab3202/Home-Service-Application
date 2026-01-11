package com.fullstack.user_service.request;

import com.fullstack.user_service.model.UserRole;
import lombok.Data;

@Data
public class UserRequest {
    private String name;
    private String email;
    private String password;
    private UserRole role;
    private String phoneNumber;
    private String address;
    private String city;
    private int pinCode;
    private String district;
    private String taluka;
    private String department;
    private String provider;
    private String otp;
}