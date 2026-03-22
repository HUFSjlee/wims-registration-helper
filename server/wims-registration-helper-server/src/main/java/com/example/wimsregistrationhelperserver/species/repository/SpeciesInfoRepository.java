package com.example.wimsregistrationhelperserver.species.repository;

import com.example.wimsregistrationhelperserver.species.domain.SpeciesInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpeciesInfoRepository extends JpaRepository<SpeciesInfo, Long> {

  Optional<SpeciesInfo> findFirstByScientificNameIgnoreCase(String scientificName);

  Optional<SpeciesInfo> findFirstByCommonNameIgnoreCase(String commonName);
}
