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
  private String address1;
  private String address2;
  private String address3;
  private String birth;
  private String gender;

  public static MeResponse from(User user) {
    return MeResponse.builder()
      .id(user.getId())
      .userType(user.getUserType())
      .name(user.getName())
      .email(user.getEmail())
      .phone(user.getPhone())
      .address1(user.getAddress1())
      .address2(user.getAddress2())
      .address3(user.getAddress3())
      .birth(user.getBirth())
      .gender(user.getGender())
      .build();
  }
}
