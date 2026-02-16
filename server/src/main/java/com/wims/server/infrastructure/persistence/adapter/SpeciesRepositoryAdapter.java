package com.wims.server.infrastructure.persistence.adapter;

import com.wims.server.domain.model.SpeciesCatalog;
import com.wims.server.domain.port.SpeciesRepositoryPort;
import com.wims.server.infrastructure.persistence.entity.SpeciesCatalogEntity;
import com.wims.server.infrastructure.persistence.repository.JpaSpeciesCatalogRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SpeciesRepositoryAdapter implements SpeciesRepositoryPort {
    private final JpaSpeciesCatalogRepository repository;

    public SpeciesRepositoryAdapter(JpaSpeciesCatalogRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<SpeciesCatalog> search(String query) {
        String q = query == null ? "" : query.trim();
        if (q.isEmpty()) {
            return repository.findAll().stream().map(this::toDomain).toList();
        }
        return repository.search(q).stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<SpeciesCatalog> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    private SpeciesCatalog toDomain(SpeciesCatalogEntity e) {
        return new SpeciesCatalog(e.getId(), e.getCategory(), e.getScientificName(), e.getKoreanName(), e.getEnglishName());
    }
}
