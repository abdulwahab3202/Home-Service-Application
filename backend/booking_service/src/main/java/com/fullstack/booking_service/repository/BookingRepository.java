package com.fullstack.booking_service.repository;

import com.fullstack.booking_service.entity.ServiceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class BookingRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void save(ServiceRequest request){
        mongoTemplate.save(request);
    }

    public List<ServiceRequest> getAllBookings(){
        Query query = new Query();
        query.with(Sort.by(Sort.Direction.DESC, "createdOn"));
        return mongoTemplate.find(query, ServiceRequest.class);
    }

    public List<ServiceRequest> findAvailableJobs(String category, String taluka) {
        Query query = new Query(
                new Criteria().andOperator(
                        Criteria.where("serviceCategory").is(category),
                        Criteria.where("taluka").is(taluka),
                        Criteria.where("status").is("OPEN")
                )
        );
        return mongoTemplate.find(query, ServiceRequest.class);
    }

    public List<ServiceRequest> findByCategory(String serviceCategory){
        Query query = new Query(Criteria.where("serviceCategory").is(serviceCategory));
        return mongoTemplate.find(query, ServiceRequest.class);
    }

    public ServiceRequest findById(String id){
        return mongoTemplate.findById(id, ServiceRequest.class);
    }

    public void deleteById(String id){
        Query query = new Query(Criteria.where("id").is(id));
        mongoTemplate.remove(query, ServiceRequest.class);
    }

    public List<ServiceRequest> findByUserId(String userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        query.with(Sort.by(Sort.Direction.DESC, "createdOn"));

        return mongoTemplate.find(query, ServiceRequest.class);
    }
}