package com.example.wimsregistrationhelperserver.species.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/** {@code species_info.common_name} 일치 시 학명, 없으면 빈 문자열 */
@Getter
@AllArgsConstructor
public class ScientificNameByCommonNameResponse {

  private final String scientificName;
}
