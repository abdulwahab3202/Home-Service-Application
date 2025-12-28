package com.fullstack.booking_service.request;

import lombok.Data;

@Data
public class UpdateBookingRequest {
    private String title;
    private String description;
    private String address;
}