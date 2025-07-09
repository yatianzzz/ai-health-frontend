package com.example.aihealthmanagement.service;

import com.example.aihealthmanagement.entity.DietaryRecord;

import java.util.List;

public interface DietaryRecordService {
    List<DietaryRecord> listByUserId(Long userId);
    DietaryRecord getById(Long id);
    DietaryRecord create(DietaryRecord record);
    void update(DietaryRecord record);
    void delete(Long id);
}
