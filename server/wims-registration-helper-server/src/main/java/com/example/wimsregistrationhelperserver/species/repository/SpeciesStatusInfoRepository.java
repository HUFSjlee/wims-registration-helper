package com.example.wimsregistrationhelperserver.species.repository;

import com.example.wimsregistrationhelperserver.species.domain.SpeciesStatusInfo;
import com.example.wimsregistrationhelperserver.species.dto.SpeciesHoldingResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpeciesStatusInfoRepository extends JpaRepository<SpeciesStatusInfo, Long> {

  @Query(
    """
    SELECT new com.example.wimsregistrationhelperserver.species.dto.SpeciesHoldingResponse(
      s.speciesId,
      MAX(i.scientificName),
      MAX(i.commonName),
      COALESCE(SUM(
        CASE
          WHEN s.logType IN ('R', 'TR') THEN s.speciesQuantity
          WHEN s.logType IN ('D', 'TD') THEN -s.speciesQuantity
          ELSE 0L
        END
      ), 0L)
    )
    FROM SpeciesStatusInfo s
    JOIN SpeciesInfo i ON i.id = s.speciesId
    WHERE s.userId = :userId
    GROUP BY s.speciesId
    HAVING COALESCE(SUM(
      CASE
        WHEN s.logType IN ('R', 'TR') THEN s.speciesQuantity
        WHEN s.logType IN ('D', 'TD') THEN -s.speciesQuantity
        ELSE 0L
      END
    ), 0L) > 0
    ORDER BY MAX(i.commonName) ASC
    """
  )
  List<SpeciesHoldingResponse> findHoldingsByUserId(@Param("userId") Long userId);

  @Query(
    """
    SELECT COALESCE(SUM(
      CASE
        WHEN s.logType IN ('R', 'TR') THEN s.speciesQuantity
        WHEN s.logType IN ('D', 'TD') THEN -s.speciesQuantity
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
