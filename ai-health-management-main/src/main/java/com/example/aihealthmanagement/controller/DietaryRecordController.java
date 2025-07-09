package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.dto.DietaryRecordDto;
import com.example.aihealthmanagement.entity.DietaryRecord;
import com.example.aihealthmanagement.security.CustomUserDetails;
import com.example.aihealthmanagement.service.DietaryRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dietary-records")
public class DietaryRecordController {

    @Autowired
    private DietaryRecordService dietaryRecordService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new ServiceException(401, "User not authenticated");
        }
        return ((CustomUserDetails) auth.getPrincipal()).getId();
    }

    @GetMapping
    public ServiceResponse<List<DietaryRecord>> list() {
        Long userId = getCurrentUserId();
        List<DietaryRecord> records = dietaryRecordService.listByUserId(userId);
        return ServiceResponse.success(records);
    }

    @GetMapping("/{id}")
    public ServiceResponse<DietaryRecord> get(@PathVariable Long id) {
        DietaryRecord record = dietaryRecordService.getById(id);
        if (record == null) {
            throw new ServiceException(404, "Record not found");
        }
        return ServiceResponse.success(record);
    }

    @PostMapping
    public ServiceResponse<?> create(@RequestBody DietaryRecordDto.RecordRequest request) {
        Long userId = getCurrentUserId();
        DietaryRecord record = DietaryRecord.builder()
                .userId(userId)
                .recordDate(request.getRecordDate())
                .recordTime(request.getRecordTime())
                .mealType(request.getMealType())
                .notes(request.getNotes())
                .totalCalories(request.getTotalCalories())
                .build();
        DietaryRecord created = dietaryRecordService.create(record);
        return ServiceResponse.success("Created", created);
    }

    @PutMapping("/{id}")
    public ServiceResponse<?> update(@PathVariable Long id, @RequestBody DietaryRecordDto.RecordRequest request) {
        Long userId = getCurrentUserId();
        DietaryRecord record = DietaryRecord.builder()
                .id(id)
                .userId(userId)
                .recordDate(request.getRecordDate())
                .recordTime(request.getRecordTime())
                .mealType(request.getMealType())
                .notes(request.getNotes())
                .totalCalories(request.getTotalCalories())
                .build();
        dietaryRecordService.update(record);
        return ServiceResponse.success("Updated", null);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<?> delete(@PathVariable Long id) {
        dietaryRecordService.delete(id);
        return ServiceResponse.success("Deleted", null);
    }
}
