package com.fullstack.user_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "email_verifications")
public class EmailVerification {
    @Id
    private String email;
    private String otp;
    @Indexed(expireAfter = "0s")
    private LocalDateTime expiryDate;
}