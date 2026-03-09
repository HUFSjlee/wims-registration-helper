package com.example.wimsregistrationhelperserver.auth.dto;

import com.example.wimsregistrationhelperserver.auth.domain.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SignupRequest {
  @NotNull(message = "회원 유형은 필수입니다.")
  private UserType userType;

  @NotBlank(message = "이름은 필수입니다.")
  private String name;

  @Email(message = "올바른 이메일 형식이어야 합니다.")
  @NotBlank(message = "이메일은 필수입니다.")
  private String email;

  @NotBlank(message = "전화번호는 필수입니다.")
  private String phone;

  @NotBlank(message = "주소1은 필수입니다.")
  private String address1;

  @NotNull(message = "주소2는 null일 수 없습니다.")
  private String address2;

  @NotNull(message = "주소3는 null일 수 없습니다.")
  private String address3;

  @NotBlank(message = "생년월일은 필수입니다.")
  private String birth;

  @NotBlank(message = "성별은 필수입니다.")
  private String gender;

  @NotBlank(message = "비밀번호는 필수입니다.")
  private String password;
}
