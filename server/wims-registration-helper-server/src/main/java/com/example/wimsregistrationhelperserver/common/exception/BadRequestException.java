package com.example.wimsregistrationhelperserver.common.exception;

public class BadRequestException extends RuntimeException {
  public BadRequestException(String message) {
        super(message);
    }
}
