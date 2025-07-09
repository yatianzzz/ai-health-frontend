package com.example.aihealthmanagement.service.impl;


import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.dto.AuthDto.RegisterResponse;
import com.example.aihealthmanagement.dto.AuthDto.LoginRequest;
import com.example.aihealthmanagement.dto.AuthDto.LoginResponse;
import com.example.aihealthmanagement.dto.AuthDto.RegisterRequest;
import com.example.aihealthmanagement.entity.User;
import com.example.aihealthmanagement.repository.UserRepository;
import com.example.aihealthmanagement.security.JwtTokenProvider;
import com.example.aihealthmanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        // 检查请求参数
        if (request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
            throw new ServiceException(400, "Username, password and email are required");
        }

        // 检查用户名是否已存在
        User existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser != null) {
            throw new ServiceException(409, "Username already exists");
        }
        // 检查邮箱是否已存在
        existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser != null) {
            throw new ServiceException(409, "Email already exists");
        }

        // 创建新用户，密码加密后存储
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .createTime(LocalDateTime.now())
                .build();

        int rows = userRepository.insert(user);
        if (rows != 1) {
            throw new ServiceException("Register failed");
        }
        RegisterResponse response = new RegisterResponse();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        return response;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // 检查请求参数
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new ServiceException(400, "Username and password are required");
        }

        User user = userRepository.findByUsername(request.getUsername());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ServiceException(400, "Username or password is incorrect");
        }

        // 生成 JWT 令牌
        String token = jwtTokenProvider.generateToken(user);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        return response;
    }
}
