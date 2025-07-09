// src/main/java/com/example/aihealthmanagement/security/CustomUserDetails.java
package com.example.aihealthmanagement.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {
    private final Long id;
    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Long id,
                             String username,
                             String password,
                             Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    /** 返回数据库中用户对应的唯一 ID */
    public Long getId() {
        return id;
    }

    /** 下面这些方法由 Spring Security 调用，返回账号信息和状态 */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    /** 这里返回登录标识（例如用户名或邮箱），可读性强 */
    @Override
    public String getUsername() {
        return username;
    }

    /** 账户是否未过期（true 表示未过期） */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /** 账户是否未被锁定（true 表示未锁定） */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /** 凭证（密码）是否未过期（true 表示未过期） */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /** 账户是否激活（true 表示激活） */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
