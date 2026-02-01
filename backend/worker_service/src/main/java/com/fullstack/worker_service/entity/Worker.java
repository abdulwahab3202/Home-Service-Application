package com.fullstack.worker_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "workers")
public class Worker {
    @Id
    private String workerId;
    @Field("user_id")
    private String userId;
    private String name;
    private String email;
    private String phoneNumber;
    private String department;
    private String district;
    private String taluka;
    private boolean isAvailable;
    private int totalCredits;
    private Date createdOn;
    private Date updatedOn;
    private String currentBookingId;
}