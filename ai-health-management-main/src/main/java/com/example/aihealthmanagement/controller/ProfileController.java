// src/main/java/com/example/aihealthmanagement/controller/ProfileController.java
package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.dto.AuthDto;
import com.example.aihealthmanagement.entity.User;
import com.example.aihealthmanagement.repository.UserRepository;
import com.example.aihealthmanagement.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.aihealthmanagement.common.ServiceException;

@RestController
@RequestMapping("/api")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ServiceResponse<AuthDto.UserInfoResponse> getProfile() {
        // 1. 从 SecurityContext 拿到 principal（CustomUserDetails）
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new ServiceException(401, "User not authenticated");
        }
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Long userId = userDetails.getId();

        // 2. 根据 ID 去数据库查
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new ServiceException(404, "User not found with id: " + userId);
        }

        // 3. 构造 DTO 并返回
        AuthDto.UserInfoResponse response = new AuthDto.UserInfoResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        return ServiceResponse.success("Profile retrieved successfully", response);

    }
}
