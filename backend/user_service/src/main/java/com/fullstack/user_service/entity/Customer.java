package com.fullstack.user_service.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.Date;

@Data
@Document(collection = "customers")
public class Customer {
    @Id
    private String id;
    @Field("user_id")
    private String userId;
    private String phoneNumber;
    private String address;
    private int pinCode;
    private String district;
    private String taluka;
    private Date createdOn;
    private Date updatedOn;
}