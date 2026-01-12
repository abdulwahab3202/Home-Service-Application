package com.fullstack.worker_service.request;

import lombok.Data;

@Data
public class JobNotificationRequest {
    private String title;
    private String category;
    private String district;
    private String taluka;
}