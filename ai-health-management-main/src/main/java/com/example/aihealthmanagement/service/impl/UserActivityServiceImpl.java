package com.example.aihealthmanagement.service.impl;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.entity.UserActivity;
import com.example.aihealthmanagement.repository.UserActivityRepository;
import com.example.aihealthmanagement.service.UserActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserActivityServiceImpl implements UserActivityService {

    private final UserActivityRepository repository;

    @Autowired
    public UserActivityServiceImpl(UserActivityRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<UserActivity> listByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public UserActivity getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void create(UserActivity activity) {
        repository.insert(activity);
    }

    @Override
    public void update(UserActivity activity) {
        if (repository.findById(activity.getId()) == null) {
            throw new ServiceException(404, "Activity not found");
        }
        repository.update(activity);
    }

    @Override
    public void delete(Long id) {
        repository.delete(id);
    }
}
