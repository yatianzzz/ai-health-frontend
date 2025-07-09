package com.example.aihealthmanagement.common;

/**
 * 自定义业务异常，包含错误码和错误信息
 */
public class ServiceException extends RuntimeException {
    private int code;

    public ServiceException(String message) {
        super(message);
        this.code = 500;
    }

    public ServiceException(int code, String message) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
