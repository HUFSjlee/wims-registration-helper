package com.example.wimsregistrationhelperserver.common.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(DuplicateResourceException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public Map<String, String> handleDuplicate(DuplicateResourceException e) {
    return Map.of("message", e.getMessage());
  }

  @ExceptionHandler(UnauthorizedException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public Map<String, String> handleUnauthorized(UnauthorizedException e) {
    return Map.of("message", e.getMessage());
  }

  @ExceptionHandler(NotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Map<String, String> handleNotFound(NotFoundException e) {
    return Map.of("message", e.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleValidation(MethodArgumentNotValidException e) {
    String message = e.getBindingResult().getFieldErrors().isEmpty()
      ? "입력값이 올바르지 않습니다."
      : e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
    return Map.of("message", message);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleConstraint(ConstraintViolationException e) {
    return Map.of("message", "입력값이 올바르지 않습니다.");
  }

  @ExceptionHandler(BadRequestException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleBadRequest(BadRequestException e) {
    return Map.of("message", e.getMessage());
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleMessageNotReadable(HttpMessageNotReadableException e) {
    String detail = e.getMostSpecificCause() == null
      ? "요청 본문을 읽을 수 없습니다."
      : e.getMostSpecificCause().getMessage();
    return Map.of("message", "요청 본문 파싱 실패: " + detail);
  }
}
