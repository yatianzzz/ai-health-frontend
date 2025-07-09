// src/main/java/com/example/aihealthmanagement/service/CustomUserDetailsService.java
package com.example.aihealthmanagement.service;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.entity.User;
import com.example.aihealthmanagement.repository.UserRepository;
import com.example.aihealthmanagement.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * 根据用户 ID 加载 UserDetails
     */
    public CustomUserDetails loadUserById(Long id) {
        User user = userRepository.findById(id);
        if (user == null) {
            throw new ServiceException(404, "User not found with id: " + id);
        }

        // 如果暂未实现角色体系，给个默认 ROLE_USER
        var authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_USER")
        );

        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}
