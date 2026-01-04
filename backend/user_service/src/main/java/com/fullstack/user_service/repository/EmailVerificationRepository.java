package com.fullstack.user_service.repository;

import com.fullstack.user_service.entity.EmailVerification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class EmailVerificationRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void save(EmailVerification verification) {
        mongoTemplate.save(verification);
    }

    public EmailVerification findById(String email) {
        return mongoTemplate.findById(email, EmailVerification.class);
    }

    public void deleteById(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        mongoTemplate.remove(query, EmailVerification.class);
    }
}