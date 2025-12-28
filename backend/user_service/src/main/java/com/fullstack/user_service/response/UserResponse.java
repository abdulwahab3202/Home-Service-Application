package com.fullstack.user_service.response;

import lombok.Data;

import java.util.Date;

@Data
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private Date createdOn;
    private Date updateOn;
}
