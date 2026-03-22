package com.example.wimsregistrationhelperserver.species.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;

import java.time.OffsetDateTime;

/**
 * {@code species_info} 테이블 매핑 엔티티입니다.
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "species_info")
public class SpeciesInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "species_id")
  private Long id;

  @Column(name = "common_name", nullable = false, length = 255)
  private String commonName;

  @Column(name = "scientific_name", nullable = false, length = 255)
  private String scientificName;

  @Column(name = "regist_date", nullable = false)
  private OffsetDateTime registDate;

  @Column(name = "modify_date", nullable = false)
  private OffsetDateTime modifyDate;

  /**
   * 신규 종 정보를 생성합니다. 학명·일반명 중 하나만 있으면 나머지 컬럼에 동일 값을 채웁니다.
   */
  public static SpeciesInfo create(String scientificName, String commonName) {
    String sci = StringUtils.hasText(scientificName) ? scientificName.trim() : "";
    String com = StringUtils.hasText(commonName) ? commonName.trim() : "";
    if (!StringUtils.hasText(sci)) {
      sci = com;
    }
    if (!StringUtils.hasText(com)) {
      com = sci;
    }
    SpeciesInfo entity = new SpeciesInfo();
    entity.scientificName = sci;
    entity.commonName = com;
    OffsetDateTime now = OffsetDateTime.now();
    entity.registDate = now;
    entity.modifyDate = now;
    return entity;
  }
}
