package com.example.wimsregistrationhelperserver.auth.dto;

import com.example.wimsregistrationhelperserver.auth.domain.User;
import com.example.wimsregistrationhelperserver.auth.domain.UserType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MeResponse {
  private Long id;
  private UserType userType;
  private String name;
  private String email;
  private String phone;
  private String address;

  public static MeResponse from(User user) {
    return MeResponse.builder()
      .id(user.getId())
      .userType(user.getUserType())
      .name(user.getName())
      .email(user.getEmail())
      .phone(user.getPhone())
      .address(user.getAddress())
      .build();
  }
}
