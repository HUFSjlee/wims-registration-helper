package com.example.wimsregistrationhelperserver.auth.domain;

/**
 * 회원 유형을 명확히 구분하기 위한 enum
 * DB에는 문자열(PERSONAL / BUSINESS)로 구분 저장
 * */
public enum UserType {
  PERSONAL,
  BUSINESS
}
