package com.fullstack.booking_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CommonResponse {
    public static ResponseEntity<CommonResponse> getResponseEntity(CommonResponse response) {
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    private HttpStatus status;
    private ResponseStatus responseStatus;
    private String message;
    private Object data;
    private int statusCode;
}
