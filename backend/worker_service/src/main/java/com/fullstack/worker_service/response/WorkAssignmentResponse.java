package com.fullstack.worker_service.response;

import lombok.Data;
import java.util.Date;

@Data
public class WorkAssignmentResponse {
    private String assignmentId;
    private String complaintId;
    private String workerId;
    private String status;
    private int creditPoints;
    private Date assignedOn;
    private Date completedOn;
}
