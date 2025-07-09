package com.example.aihealthmanagement.service.impl;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.entity.DietaryRecord;
import com.example.aihealthmanagement.repository.DietaryRecordRepository;
import com.example.aihealthmanagement.service.DietaryRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DietaryRecordServiceImpl implements DietaryRecordService {

    private final DietaryRecordRepository repository;

    @Autowired
    public DietaryRecordServiceImpl(DietaryRecordRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<DietaryRecord> listByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public DietaryRecord getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public DietaryRecord create(DietaryRecord record) {
        record.setCreateTime(LocalDateTime.now());
        repository.insert(record);
        return record;
    }

    @Override
    public void update(DietaryRecord record) {
        if (repository.findById(record.getId()) == null) {
            throw new ServiceException(404, "Record not found");
        }
        repository.update(record);
    }

    @Override
    public void delete(Long id) {
        repository.delete(id);
    }
}
