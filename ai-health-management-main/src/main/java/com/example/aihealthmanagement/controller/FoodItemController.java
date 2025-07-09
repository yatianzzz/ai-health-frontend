package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.dto.FoodItemDto;
import com.example.aihealthmanagement.entity.FoodItem;
import com.example.aihealthmanagement.service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @GetMapping
    public ServiceResponse<List<FoodItem>> list(@RequestParam Long recordId) {
        List<FoodItem> items = foodItemService.listByRecordId(recordId);
        return ServiceResponse.success(items);
    }

    @GetMapping("/{id}")
    public ServiceResponse<FoodItem> get(@PathVariable Long id) {
        FoodItem item = foodItemService.getById(id);
        if (item == null) {
            throw new ServiceException(404, "Food item not found");
        }
        return ServiceResponse.success(item);
    }

    @PostMapping
    public ServiceResponse<?> create(@RequestBody FoodItemDto.ItemRequest request) {
        FoodItem item = FoodItem.builder()
                .dietaryRecordId(request.getDietaryRecordId())
                .name(request.getName())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .calories(request.getCalories())
                .build();
        foodItemService.create(item);
        return ServiceResponse.success("Created", null);
    }

    @PutMapping("/{id}")
    public ServiceResponse<?> update(@PathVariable Long id, @RequestBody FoodItemDto.ItemRequest request) {
        FoodItem item = FoodItem.builder()
                .id(id)
                .dietaryRecordId(request.getDietaryRecordId())
                .name(request.getName())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .calories(request.getCalories())
                .build();
        foodItemService.update(item);
        return ServiceResponse.success("Updated", null);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<?> delete(@PathVariable Long id) {
        foodItemService.delete(id);
        return ServiceResponse.success("Deleted", null);
    }
}
