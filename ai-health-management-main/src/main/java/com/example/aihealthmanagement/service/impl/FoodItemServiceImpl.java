package com.example.aihealthmanagement.service.impl;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.entity.FoodItem;
import com.example.aihealthmanagement.repository.FoodItemRepository;
import com.example.aihealthmanagement.service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodItemServiceImpl implements FoodItemService {

    private final FoodItemRepository repository;

    @Autowired
    public FoodItemServiceImpl(FoodItemRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<FoodItem> listByRecordId(Long recordId) {
        return repository.findByRecordId(recordId);
    }

    @Override
    public FoodItem getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void create(FoodItem item) {
        item.setCreateTime(LocalDateTime.now());
        repository.insert(item);
    }

    @Override
    public void update(FoodItem item) {
        if (repository.findById(item.getId()) == null) {
            throw new ServiceException(404, "Food item not found");
        }
        repository.update(item);
    }

    @Override
    public void delete(Long id) {
        repository.delete(id);
    }
}
