package com.example.aihealthmanagement.dto;

import lombok.Data;

public class UserProfileDto {
    @Data
    public static class ProfileRequest {
        private String lastName;
        private String firstName;
        private Integer age;
        private String occupation;
        private String gender;
        private String favoriteSport;
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private Long userId;
        private String lastName;
        private String firstName;
        private Integer age;
        private String occupation;
        private String gender;
        private String favoriteSport;
    }
}
