package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.dto.AuthDto;
import com.example.aihealthmanagement.dto.AuthDto.LoginRequest;
import com.example.aihealthmanagement.dto.AuthDto.RegisterRequest;
import com.example.aihealthmanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ServiceResponse<AuthDto.RegisterResponse> register(@RequestBody RegisterRequest request) {
        AuthDto.RegisterResponse response = authService.register(request);
        return ServiceResponse.success("Register success", response);
    }

    @PostMapping("/login")
    public ServiceResponse<AuthDto.LoginResponse> login(@RequestBody LoginRequest request) {
        AuthDto.LoginResponse response = authService.login(request);
        return ServiceResponse.success("Login success", response);
    }
}
