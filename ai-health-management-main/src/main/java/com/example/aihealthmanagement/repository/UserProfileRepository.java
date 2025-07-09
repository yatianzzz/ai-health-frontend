package com.example.aihealthmanagement.repository;

import com.example.aihealthmanagement.entity.UserProfile;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserProfileRepository {
    @Select("SELECT * FROM user_profile WHERE user_id = #{userId}")
    UserProfile findByUserId(@Param("userId") Long userId);

    @Insert("INSERT INTO user_profile(user_id, last_name, first_name, age, occupation, gender, favorite_sport) " +
            "VALUES(#{userId}, #{lastName}, #{firstName}, #{age}, #{occupation}, #{gender}, #{favoriteSport})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UserProfile profile);

    @Update("UPDATE user_profile SET last_name=#{lastName}, first_name=#{firstName}, age=#{age}, occupation=#{occupation}, gender=#{gender}, favorite_sport=#{favoriteSport} WHERE user_id=#{userId}")
    int update(UserProfile profile);

    @Delete("DELETE FROM user_profile WHERE user_id = #{userId}")
    int deleteByUserId(@Param("userId") Long userId);
}
