package com.example.aihealthmanagement.repository;

import com.example.aihealthmanagement.entity.DietaryRecord;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface DietaryRecordRepository {
    @Select("SELECT * FROM dietary_record WHERE user_id = #{userId}")
    List<DietaryRecord> findByUserId(@Param("userId") Long userId);

    @Select("SELECT * FROM dietary_record WHERE id = #{id}")
    DietaryRecord findById(@Param("id") Long id);

    @Insert("INSERT INTO dietary_record(user_id, record_date, record_time, meal_type, notes, total_calories, create_time) " +
            "VALUES(#{userId}, #{recordDate}, #{recordTime}, #{mealType}, #{notes}, #{totalCalories}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(DietaryRecord record);

    @Update("UPDATE dietary_record SET record_date=#{recordDate}, record_time=#{recordTime}, meal_type=#{mealType}, notes=#{notes}, total_calories=#{totalCalories} WHERE id=#{id}")
    int update(DietaryRecord record);

    @Delete("DELETE FROM dietary_record WHERE id = #{id}")
    int delete(@Param("id") Long id);

    @Select("SELECT record_date, SUM(total_calories) as totalCalories " +
            "FROM dietary_record " +
            "WHERE user_id = #{userId} " +
            "AND record_date >= #{startDate} " +
            "AND record_date <= #{endDate} " +
            "GROUP BY record_date " +
            "ORDER BY record_date")
    List<Map<String, Object>> getCaloriesIntakeByUserAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );
}
