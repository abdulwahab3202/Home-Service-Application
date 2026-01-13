package com.fullstack.user_service.response;

import lombok.Data;
import java.util.Date;

@Data
public class CustomerResponse {
    private String userId;
    private String name;
    private String email;
    private String role;
    private String phoneNumber;
    private String district;
    private String taluka;
    private String address;
    private int pinCode;
    private Date createdOn;
    private Date updateOn;
}