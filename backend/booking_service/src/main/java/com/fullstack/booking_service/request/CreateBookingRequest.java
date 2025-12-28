package com.fullstack.booking_service.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingRequest {
    private String title;
    private String description;
    private String serviceCategory;
    private String address;
    private MultipartFile image;
}