package com.example.wimsregistrationhelperserver.transfer.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "transfer_info")
public class TransferInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "transfer_id")
  private Long id;

  @Column(name = "transfer_key", nullable = false, length = 255)
  private String transferKey;

  @Column(name = "transferor_id", nullable = false)
  private Long transferorId;

  @Column(name = "transferee_id", nullable = false)
  private Long transfereeId;

  @Column(name = "species_id", nullable = false)
  private Long speciesId;

  @Column(name = "species_quantity", nullable = false)
  private Long speciesQuantity;

  @Column(name = "scientific_name", nullable = false, length = 255)
  private String scientificName;

  @Column(name = "common_name", nullable = false, length = 255)
  private String commonName;

  @Column(name = "regist_id", nullable = false)
  private Long registId;

  @Column(name = "regist_date", nullable = false)
  private OffsetDateTime registDate;

  @Column(name = "modify_id", nullable = false)
  private Long modifyId;

  @Column(name = "modify_date", nullable = false)
  private OffsetDateTime modifyDate;

  /**
   * 양도 접수 생성 시, 사용하는 정적 팩토리 메서드
   * 생성 시점에는 등록자와 수정자를 동일하게 양도자로 넣는다 <- 이 부분 체크해야함
   * */
  public static TransferInfo create(
    String transferKey,
    Long transferorId,
    Long transfereeId,
    Long speciesId,
    Long speciesQuantity,
    String scientificName,
    String commonName
  ) {
    TransferInfo transferInfo = new TransferInfo();
    transferInfo.transferKey = transferKey;
    transferInfo.transferorId = transferorId;
    transferInfo.transfereeId = transfereeId;
    transferInfo.speciesId = speciesId;
    transferInfo.speciesQuantity = speciesQuantity;
    transferInfo.scientificName = scientificName;
    transferInfo.commonName = commonName;
    transferInfo.registId = transferorId;
    transferInfo.modifyId = transferorId;
    transferInfo.registDate = OffsetDateTime.now();
    transferInfo.modifyDate = OffsetDateTime.now();
    return transferInfo;
  }

  /**
   * 상태 컬럼이 아직 없으므로 현재 단계에서는
   * modify 필드를 완료 처리 시점 정보로 사용합니다.
   */
  public void completeBy(Long completedUserId) {
    this.modifyId = completedUserId;
    this.modifyDate = OffsetDateTime.now();
  }

  public boolean isCompleted() {
    return modifyId != null
      && transfereeId != null
      && modifyId.equals(transfereeId)
      && modifyDate != null
      && registDate != null
      && modifyDate.isAfter(registDate);
  }
}
