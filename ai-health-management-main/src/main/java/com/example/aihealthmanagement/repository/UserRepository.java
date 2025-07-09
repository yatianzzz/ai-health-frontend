package com.example.aihealthmanagement.repository;

import com.example.aihealthmanagement.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserRepository {

    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(@Param("username") String username);

    @Insert("INSERT INTO user(username, password, email, create_time) " +
            "VALUES(#{username}, #{password}, #{email}, #{createTime})")
    int insert(User user);

    // Find by email
    @Select("SELECT * FROM user WHERE email = #{email}")
    User findByEmail(@Param("email") String email);

    // Find by ID
    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(@Param("id") Long id);
}
