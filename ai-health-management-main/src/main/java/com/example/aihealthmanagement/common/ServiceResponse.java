package com.example.aihealthmanagement.common;

import lombok.Data;

/**
 * 通用响应封装类
 */
@Data
public class ServiceResponse<T> {
    /**
     * 状态码，200 表示成功，其它根据需要定义
     */
    private int code;

    /**
     * 响应提示信息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    public ServiceResponse() {
    }

    public ServiceResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // 成功响应的静态构造方法
    public static <T> ServiceResponse<T> success(T data) {
        return new ServiceResponse<>(200, "Success", data);
    }

    public static <T> ServiceResponse<T> success(String message, T data) {
        return new ServiceResponse<>(200, message, data);
    }

    // 失败响应的静态构造方法
    public static <T> ServiceResponse<T> error(int code, String message) {
        return new ServiceResponse<>(code, message, null);
    }

    public static <T> ServiceResponse<T> error(String message) {
        return new ServiceResponse<>(500, message, null);
    }
}
