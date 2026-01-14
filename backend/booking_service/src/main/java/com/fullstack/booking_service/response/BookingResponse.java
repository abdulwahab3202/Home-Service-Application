package com.fullstack.booking_service.response;

import lombok.Data;
import java.util.Date;

@Data
public class BookingResponse {
    private String id;
    private String userId;
    private String imageUrl;
    private String title;
    private String description;
    private String serviceCategory;
    private String address;
    private Double latitude;
    private Double longitude;
    private String status;
    private String cancellationReason;
    private Date createdOn;
    private Date updatedOn;
}