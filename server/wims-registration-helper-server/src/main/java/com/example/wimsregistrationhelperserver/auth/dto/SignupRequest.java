package com.example.wimsregistrationhelperserver.auth.dto;

import com.example.wimsregistrationhelperserver.auth.domain.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

/**
 * 회원가입 요청 DTO
 * Controller에서 @Valid로 자동 검증
 * */
@Getter
public class SignupRequest {
  @NotNull(message = "회원 유형은 필수입니다.")
  private UserType userType;

  @NotBlank(message = "이름은 필수입니다.")
  private String name;

  @Email(message = "올바른 이메일 형식이 아닙니다.")
  @NotBlank(message = "이메일은 필수입니다.")
  private String email;

  @NotBlank(message = "전화번호는 필수입니다.")
  private String phone;

  @NotBlank(message = "주소는 필수입니다.")
  private String address;

  @NotBlank(message = "비밀번호는 필수입니다.")
  private String password;
}
