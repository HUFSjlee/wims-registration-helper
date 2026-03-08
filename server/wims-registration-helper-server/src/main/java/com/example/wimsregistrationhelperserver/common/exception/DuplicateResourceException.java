package com.example.wimsregistrationhelperserver.common.exception;

/**
 * 유니크한 리소스(이메일, 전화번호 등)가 이미 존재할 떄 사용
 * */
public class DuplicateResourceException extends RuntimeException {
  public DuplicateResourceException(String message) {
    super(message);
  }
}
