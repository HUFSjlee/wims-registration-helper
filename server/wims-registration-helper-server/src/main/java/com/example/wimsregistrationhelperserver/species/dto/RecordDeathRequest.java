package com.example.wimsregistrationhelperserver.species.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RecordDeathRequest {

  @NotNull(message = "개체(species) ID는 필수입니다.")
  private Long speciesId;

  @NotBlank(message = "폐사 수량은 필수입니다.")
  private String quantity;
}
