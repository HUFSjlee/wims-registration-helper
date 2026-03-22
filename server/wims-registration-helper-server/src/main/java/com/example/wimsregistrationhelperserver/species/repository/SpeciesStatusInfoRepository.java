package com.example.wimsregistrationhelperserver.species.repository;

import com.example.wimsregistrationhelperserver.species.domain.SpeciesStatusInfo;
import com.example.wimsregistrationhelperserver.species.dto.SpeciesHoldingResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpeciesStatusInfoRepository extends JpaRepository<SpeciesStatusInfo, Long> {

  /**
   * 사용자 ID·종 ID 기준으로 그룹화하여, log_type 1은 더하고 2는 뺀 순수량이 0보다 큰 행만 반환합니다.
   */
  @Query(
    """
    SELECT new com.example.wimsregistrationhelperserver.species.dto.SpeciesHoldingResponse(
      s.speciesId,
      MAX(i.scientificName),
      MAX(i.commonName),
      COALESCE(SUM(CASE WHEN s.logType = '1' THEN s.speciesQuantity ELSE 0L END), 0L)
        - COALESCE(SUM(CASE WHEN s.logType = '2' THEN s.speciesQuantity ELSE 0L END), 0L)
    )
    FROM SpeciesStatusInfo s
    JOIN SpeciesInfo i ON i.id = s.speciesId
    WHERE s.userId = :userId
    GROUP BY s.speciesId
    HAVING COALESCE(SUM(CASE WHEN s.logType = '1' THEN s.speciesQuantity ELSE 0L END), 0L)
         - COALESCE(SUM(CASE WHEN s.logType = '2' THEN s.speciesQuantity ELSE 0L END), 0L) > 0
    ORDER BY MAX(i.commonName) ASC
    """
  )
  List<SpeciesHoldingResponse> findHoldingsByUserId(@Param("userId") Long userId);

  /**
   * 해당 사용자·종에 대한 순수량(등록 합 − 폐사 합). 로그가 없으면 null.
   */
  @Query(
    """
    SELECT COALESCE(SUM(
      CASE
        WHEN s.logType = '1' THEN s.speciesQuantity
        WHEN s.logType = '2' THEN -s.speciesQuantity
        ELSE 0L
      END
    ), 0L)
    FROM SpeciesStatusInfo s
    WHERE s.userId = :userId AND s.speciesId = :speciesId
    """
  )
  Long computeNetQuantityByUserIdAndSpeciesId(
    @Param("userId") Long userId,
    @Param("speciesId") Long speciesId
  );
}
