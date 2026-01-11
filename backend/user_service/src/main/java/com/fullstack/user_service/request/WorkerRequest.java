package com.fullstack.user_service.request;

import lombok.Data;

@Data
public class WorkerRequest {
    private String userId;
    private String name;
    private String email;
    private String phoneNumber;
    private String department;
    private String district;
    private String taluka;
}