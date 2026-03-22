package com.example.wimsregistrationhelperserver.species.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * {@code species_status_info} 테이블 매핑 엔티티입니다. (등록/양도 등 상태 로그)
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "species_status_info")
public class SpeciesStatusInfo {

  /** 등록 시 {@code "1"} */
  public static final String LOG_TYPE_REGISTER = "1";

  /** 폐사(삭제) 시 {@code "2"} */
  public static final String LOG_TYPE_DEATH = "2";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "log_id")
  private Long logId;

  @Column(name = "log_type", nullable = false, length = 50)
  private String logType;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "species_id", nullable = false)
  private Long speciesId;

  @Column(name = "scientific_name", nullable = false, length = 255)
  private String scientificName;

  @Column(name = "common_name", nullable = false, length = 255)
  private String commonName;

  @Column(name = "species_quantity", nullable = false)
  private Long speciesQuantity;

  @Column(name = "regist_date", nullable = false)
  private OffsetDateTime registDate;

  @Column(name = "modify_date", nullable = false)
  private OffsetDateTime modifyDate;

  public static SpeciesStatusInfo create(
    Long userId,
    Long speciesId,
    String scientificName,
    String commonName,
    long speciesQuantity,
    String logType
  ) {
    SpeciesStatusInfo entity = new SpeciesStatusInfo();
    entity.logType = logType;
    entity.userId = userId;
    entity.speciesId = speciesId;
    entity.scientificName = scientificName != null ? scientificName : "";
    entity.commonName = commonName != null ? commonName : "";
    entity.speciesQuantity = speciesQuantity;
    OffsetDateTime now = OffsetDateTime.now();
    entity.registDate = now;
    entity.modifyDate = now;
    return entity;
  }
}
