package com.wims.server.domain.port;

import com.wims.server.domain.model.SpeciesCatalog;

import java.util.List;
import java.util.Optional;

public interface SpeciesRepositoryPort {
    List<SpeciesCatalog> search(String query);

    Optional<SpeciesCatalog> findById(Long id);
}
