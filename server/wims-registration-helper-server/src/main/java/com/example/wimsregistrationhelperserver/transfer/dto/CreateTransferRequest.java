package com.example.wimsregistrationhelperserver.transfer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * 양도 접수 생성 요청 DTO입니다.
 *
 * record는 요청 JSON을 명확하게 매핑하기 좋고,
 * 현재처럼 RequestBody 바인딩 이슈를 줄이는 데 유리합니다.
 */
public record CreateTransferRequest(
  @NotNull(message = "개체 ID는 필수입니다.")
  Long speciesId,

  @NotBlank(message = "학명은 필수입니다.")
  String scientificName,

  @NotBlank(message = "일반명은 필수입니다.")
  String commonName,

  @NotNull(message = "수량은 필수입니다.")
  @Positive(message = "수량은 1 이상이어야 합니다.")
  Long speciesQuantity,

  @NotBlank(message = "양수자 전화번호는 필수입니다.")
  String transfereePhone
) {
}
