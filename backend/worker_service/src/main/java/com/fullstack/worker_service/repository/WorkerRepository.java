package com.fullstack.worker_service.repository;

import com.fullstack.worker_service.entity.Worker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class WorkerRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void save(Worker worker) {
        mongoTemplate.save(worker);
    }

    public Worker getWorkerById(String id) {
        return mongoTemplate.findById(id, Worker.class);
    }

    public List<Worker> getAllWorkers() {
        return mongoTemplate.findAll(Worker.class);
    }

    public void deleteWorkerById(String id) {
        Worker worker = getWorkerById(id);
        if (worker != null) {
            mongoTemplate.remove(worker);
        }
    }

    public List<Worker> findByDepartmentAndDistrictAndTaluka(String department, String district, String taluka) {
        Query query = new Query(
                Criteria.where("department").is(department)
                        .and("district").is(district)
                        .and("taluka").is(taluka)
        );
        return mongoTemplate.find(query, Worker.class);
    }


    public Worker findByEmail(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        return mongoTemplate.findOne(query, Worker.class);
    }

    public List<Worker> findByDepartment(String department) {
        Query query = new Query(Criteria.where("department").is(department));
        return mongoTemplate.find(query, Worker.class);
    }

    public List<Worker> findAvailableWorkers() {
        Query query = new Query(Criteria.where("isAvailable").is(true));
        return mongoTemplate.find(query,Worker.class);
    }
}