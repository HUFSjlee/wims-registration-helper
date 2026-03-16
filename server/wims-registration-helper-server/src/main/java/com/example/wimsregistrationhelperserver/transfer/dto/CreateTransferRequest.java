package com.example.wimsregistrationhelperserver.transfer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;

/**
 * 양도 접수 생성 요정 DTO
 * 양도자 정보는 로그인 사용자 기준으로 서버에서 가져오므로,
 * 요청값에는 받는 사람 전화번호와 양도 대상 개체 정보만 받는다.
 * */
@Getter
public class CreateTransferRequest {
  @NotNull(message = "개체 ID는 필수입니다.")
  private Long speciesId;

  @NotBlank(message = "학명은 필수입니다.")
  private String scientificName;

  @NotBlank(message = "일반명은 필수입니다.")
  private String commonName;

  @NotNull(message = "수량은 필수입니다.")
  @Positive(message = "수량은 1 이상이어야 합니다.")
  private Long speciesQuantity;

  @NotBlank(message = "양수자 전화번호는 필수입니다.")
  private String transfereePhone;
}
