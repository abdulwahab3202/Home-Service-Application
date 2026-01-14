package com.fullstack.booking_service.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "service_requests")
public class ServiceRequest {
    @Id
    private String id;
    private String userId;
    private String imageUrl;
    private String title;
    private String description;
    private String serviceCategory;
    private String district;
    private String taluka;
    private String address;
    private String status;
    private String cancellationReason;
    private Date createdOn;
    private Date updatedOn;
}