package com.fullstack.worker_service.request;
import lombok.Data;

@Data
public class WorkAssignmentRequest {
    private String workerId;
    private String bookingId;
    private int creditPoints;
}