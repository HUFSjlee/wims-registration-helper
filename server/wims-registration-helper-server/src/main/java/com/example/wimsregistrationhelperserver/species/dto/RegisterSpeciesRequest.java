package com.example.wimsregistrationhelperserver.species.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 개체 등록(보관) 요청 본문입니다.
 */
@Getter
@Setter
@NoArgsConstructor
public class RegisterSpeciesRequest {

  private String scientificName;

  private String commonName;

  @NotBlank(message = "수량은 필수입니다.")
  private String quantity;
}
