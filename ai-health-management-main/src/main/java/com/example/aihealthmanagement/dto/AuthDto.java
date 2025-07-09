package com.example.aihealthmanagement.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
    }

    @Data
    public static class RegisterResponse {
        private String username;
        private String email;
    }

    @Data
    public static class UserInfoResponse {
        private Long id;
        private String username;
        private String email;
    }

}

