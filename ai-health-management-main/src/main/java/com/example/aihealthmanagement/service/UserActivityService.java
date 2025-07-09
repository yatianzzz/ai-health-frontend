package com.example.aihealthmanagement.service;

import com.example.aihealthmanagement.entity.UserActivity;

import java.util.List;

public interface UserActivityService {
    List<UserActivity> listByUserId(Long userId);
    UserActivity getById(Long id);
    void create(UserActivity activity);
    void update(UserActivity activity);
    void delete(Long id);
}
