package com.fullstack.booking_service.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateBookingRequest {
    private String title;
    private String description;
    private String serviceCategory;
    private String address;
    private String district;
    private String taluka;
    private MultipartFile image;
}