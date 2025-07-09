package com.example.aihealthmanagement.repository;

import com.example.aihealthmanagement.entity.FoodItem;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface FoodItemRepository {
    @Select("SELECT * FROM food_item WHERE dietary_record_id = #{recordId}")
    List<FoodItem> findByRecordId(@Param("recordId") Long recordId);

    @Select("SELECT * FROM food_item WHERE id = #{id}")
    FoodItem findById(@Param("id") Long id);

    @Insert("INSERT INTO food_item(dietary_record_id, name, category, quantity, unit, calories, create_time) " +
            "VALUES(#{dietaryRecordId}, #{name}, #{category}, #{quantity}, #{unit}, #{calories}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FoodItem item);

    @Update("UPDATE food_item SET name=#{name}, category=#{category}, quantity=#{quantity}, unit=#{unit}, calories=#{calories} WHERE id=#{id}")
    int update(FoodItem item);

    @Delete("DELETE FROM food_item WHERE id = #{id}")
    int delete(@Param("id") Long id);

    @Select("SELECT fi.category, SUM(fi.quantity) as totalQuantity, SUM(fi.calories) as totalCalories " +
            "FROM food_item fi " +
            "JOIN dietary_record dr ON fi.dietary_record_id = dr.id " +
            "WHERE dr.user_id = #{userId} " +
            "AND dr.record_date >= #{startDate} " +
            "AND dr.record_date <= #{endDate} " +
            "GROUP BY fi.category")
    List<Map<String, Object>> getCategoryDataByUserAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );
}
