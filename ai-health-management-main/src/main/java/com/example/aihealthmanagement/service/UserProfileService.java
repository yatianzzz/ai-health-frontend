package com.example.aihealthmanagement.service;

import com.example.aihealthmanagement.entity.UserProfile;

public interface UserProfileService {
    UserProfile getByUserId(Long userId);
    void create(UserProfile profile);
    void update(UserProfile profile);
    void deleteByUserId(Long userId);
}
