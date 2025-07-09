package com.example.aihealthmanagement.service.impl;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.entity.UserProfile;
import com.example.aihealthmanagement.repository.UserProfileRepository;
import com.example.aihealthmanagement.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository repository;

    @Autowired
    public UserProfileServiceImpl(UserProfileRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserProfile getByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public void create(UserProfile profile) {
        if (repository.findByUserId(profile.getUserId()) != null) {
            throw new ServiceException(400, "Profile already exists");
        }
        repository.insert(profile);
    }

    @Override
    public void update(UserProfile profile) {
        if (repository.findByUserId(profile.getUserId()) == null) {
            throw new ServiceException(404, "Profile not found");
        }
        repository.update(profile);
    }

    @Override
    public void deleteByUserId(Long userId) {
        repository.deleteByUserId(userId);
    }
}
