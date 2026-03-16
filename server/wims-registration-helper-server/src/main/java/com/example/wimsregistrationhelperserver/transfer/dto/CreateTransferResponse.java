package com.example.wimsregistrationhelperserver.transfer.dto;

import com.example.wimsregistrationhelperserver.transfer.domain.TransferInfo;
import lombok.Builder;
import lombok.Getter;

/**
 * 양도 접수 생성 후 프론트에 내려주는 응답 DTO
 *
 * transferKey와 transferLink를 같이 내려주면, 이후 카카오톡/SMS 전송 기능과 쉽게 연결할 수 있음
 * */
@Getter
@Builder
public class CreateTransferResponse {
  private Long transferId;
  private String transferKey;
  private String transferLink;
  private Long transferorId;
  private Long transfereeId;
  private Long speciesId;
  private Long speciesQuantity;
  private String scientificName;
  private String commonName;


  /**
   * https://your-client-domain은 나중에 실제 프론트 주소로 변경
   * 지금은 링크 문자열만 만들어줌.
   * */
  public static CreateTransferResponse from(TransferInfo transferInfo) {
    return CreateTransferResponse.builder()
      .transferId(transferInfo.getId())
      .transferKey(transferInfo.getTransferKey())
      .transferLink("https://your-client-domain/transfer/" + transferInfo.getTransferKey())
      .transferorId(transferInfo.getTransferorId())
      .transfereeId(transferInfo.getTransfereeId())
      .speciesId(transferInfo.getSpeciesId())
      .speciesQuantity(transferInfo.getSpeciesQuantity())
      .scientificName(transferInfo.getScientificName())
      .commonName(transferInfo.getCommonName())
      .build();
  }
}
