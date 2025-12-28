package com.fullstack.worker_service.repository;

import com.fullstack.worker_service.entity.WorkAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class WorkAssignmentRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public WorkAssignment save(WorkAssignment assignment) {
        return mongoTemplate.save(assignment);
    }

    public WorkAssignment findById(String assignmentId) {
        return mongoTemplate.findById(assignmentId, WorkAssignment.class);
    }

    public List<WorkAssignment> findAll() {
        return mongoTemplate.findAll(WorkAssignment.class);
    }

    public void deleteById(String assignmentId) {
        Query query = new Query(Criteria.where("assignmentId").is(assignmentId));
        mongoTemplate.remove(query, WorkAssignment.class);
    }

    public List<WorkAssignment> findAssignmentsByWorkerId(String workerId) {
        Query query = new Query(Criteria.where("workerId").is(workerId));
        return mongoTemplate.find(query, WorkAssignment.class);
    }

    public WorkAssignment findByBookingId(String bookingId) {
        Query query = new Query(Criteria.where("bookingId").is(bookingId));
        return mongoTemplate.findOne(query, WorkAssignment.class);
    }
}