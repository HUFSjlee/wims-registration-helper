package com.example.wimsregistrationhelperserver.auth.dto;

import com.example.wimsregistrationhelperserver.auth.domain.User;
import com.example.wimsregistrationhelperserver.auth.domain.UserType;
import lombok.Builder;
import lombok.Getter;

/**
 * 회원가입 응답 DTO.
 * 비밀번호/해시는 절대 응답으로 내보내지 않는다.
 */
@Getter
@Builder
public class SignupResponse {
  private Long id;
  private UserType userType;
  private String name;
  private String email;
  private String phone;
  private String address;

  public static SignupResponse from(User user) {
    return SignupResponse.builder()
      .id(user.getId())
      .userType(user.getUserType())
      .name(user.getName())
      .email(user.getEmail())
      .phone(user.getPhone())
      .address(user.getAddress())
      .build();
  }
}
