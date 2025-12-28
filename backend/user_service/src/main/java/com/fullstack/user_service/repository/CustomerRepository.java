package com.fullstack.user_service.repository;

import com.fullstack.user_service.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class CustomerRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void save(Customer customer) {
        mongoTemplate.save(customer);
    }

    public List<Customer> getAllCustomers(){
        return mongoTemplate.findAll(Customer.class);
    }

    public Customer findByUserId(String userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        return mongoTemplate.findOne(query, Customer.class);
    }

    public void deleteByUserId(String userId) {
        Customer customer = findByUserId(userId);
        if(customer != null){
            mongoTemplate.remove(customer);
        }
    }
}