package com.fullstack.user_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserContactDTO {
    private String name;
    private String email;
    private String phoneNumber;
}
