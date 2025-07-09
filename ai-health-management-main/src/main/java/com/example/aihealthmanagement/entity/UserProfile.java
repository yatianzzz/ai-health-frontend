package com.example.aihealthmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private Long id;
    private Long userId;
    private String lastName;
    private String firstName;
    private Integer age;
    private String occupation;
    private String gender;
    private String favoriteSport;
}
