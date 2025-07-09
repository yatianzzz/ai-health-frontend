package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.dto.UserProfileDto;
import com.example.aihealthmanagement.entity.UserProfile;
import com.example.aihealthmanagement.security.CustomUserDetails;
import com.example.aihealthmanagement.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new ServiceException(401, "User not authenticated");
        }
        return ((CustomUserDetails) auth.getPrincipal()).getId();
    }

    @GetMapping
    public ServiceResponse<UserProfile> getProfile() {
        Long userId = getCurrentUserId();
        UserProfile profile = userProfileService.getByUserId(userId);
        if (profile == null) {
            throw new ServiceException(404, "Profile not found");
        }
        return ServiceResponse.success(profile);
    }

    @PostMapping
    public ServiceResponse<?> createProfile(@RequestBody UserProfileDto.ProfileRequest request) {
        Long userId = getCurrentUserId();
        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .lastName(request.getLastName())
                .firstName(request.getFirstName())
                .age(request.getAge())
                .occupation(request.getOccupation())
                .gender(request.getGender())
                .favoriteSport(request.getFavoriteSport())
                .build();
        userProfileService.create(profile);
        return ServiceResponse.success("Created", null);
    }

    @PutMapping
    public ServiceResponse<?> updateProfile(@RequestBody UserProfileDto.ProfileRequest request) {
        Long userId = getCurrentUserId();
        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .lastName(request.getLastName())
                .firstName(request.getFirstName())
                .age(request.getAge())
                .occupation(request.getOccupation())
                .gender(request.getGender())
                .favoriteSport(request.getFavoriteSport())
                .build();
        userProfileService.update(profile);
        return ServiceResponse.success("Updated", null);
    }

    @DeleteMapping
    public ServiceResponse<?> deleteProfile() {
        Long userId = getCurrentUserId();
        userProfileService.deleteByUserId(userId);
        return ServiceResponse.success("Deleted", null);
    }
}
