package com.example.aihealthmanagement.service;

import com.example.aihealthmanagement.entity.FoodItem;

import java.util.List;

public interface FoodItemService {
    List<FoodItem> listByRecordId(Long recordId);
    FoodItem getById(Long id);
    void create(FoodItem item);
    void update(FoodItem item);
    void delete(Long id);
}
