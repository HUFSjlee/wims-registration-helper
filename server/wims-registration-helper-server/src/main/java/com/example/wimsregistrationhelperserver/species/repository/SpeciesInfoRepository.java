package com.example.wimsregistrationhelperserver.species.repository;

import com.example.wimsregistrationhelperserver.species.domain.SpeciesInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SpeciesInfoRepository extends JpaRepository<SpeciesInfo, Long> {

  Optional<SpeciesInfo> findFirstByScientificNameIgnoreCase(String scientificName);

  Optional<SpeciesInfo> findFirstByCommonNameIgnoreCase(String commonName);

  /**
   * 일반명 비교 시 앞뒤 공백 제거·소문자·모든 공백 문자 제거 후 같으면 일치 (예: "크레스티드게코" = "크레스티드 게코").
   */
  @Query(
    value = """
      SELECT * FROM species_info s
      WHERE regexp_replace(lower(trim(s.common_name)), '\\s', '', 'g')
            = regexp_replace(lower(trim(:commonName)), '\\s', '', 'g')
      ORDER BY s.species_id ASC
      LIMIT 1
      """,
    nativeQuery = true
  )
  Optional<SpeciesInfo> findFirstByCommonNameIgnoringWhitespace(@Param("commonName") String commonName);
}
