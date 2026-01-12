package com.fullstack.booking_service.request;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobNotificationRequest {
    private String title;
    private String category;
    private String district;
    private String taluka;
}