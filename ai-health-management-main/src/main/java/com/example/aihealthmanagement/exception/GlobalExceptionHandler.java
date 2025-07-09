package com.example.aihealthmanagement.exception;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.common.ServiceResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器，统一捕获异常并返回标准格式响应
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 捕获业务异常 ServiceException
     */
    @ExceptionHandler(ServiceException.class)
    public ServiceResponse<?> handleServiceException(ServiceException ex) {
        return ServiceResponse.error(ex.getCode(), ex.getMessage());
    }

    /**
     * 捕获所有其它未处理异常
     */
    @ExceptionHandler(Exception.class)
    public ServiceResponse<?> handleException(Exception ex) {
        // 可以记录日志 ex.printStackTrace();
        ex.printStackTrace();
        return ServiceResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error");
    }
}
