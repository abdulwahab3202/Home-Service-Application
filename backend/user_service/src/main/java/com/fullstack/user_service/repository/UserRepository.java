package com.fullstack.user_service.repository;

import com.fullstack.user_service.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class UserRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public User save(User user){
        return mongoTemplate.save(user);
    }

    public List<User> getAllUsers(){
        return mongoTemplate.findAll(User.class);
    }

    public User getUserById(String id){
        return mongoTemplate.findById(id,User.class);
    }

    public void deleteUserById(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        mongoTemplate.remove(query, User.class);
    }

    public User findByEmail(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        return mongoTemplate.findOne(query,User.class);
    }
}
