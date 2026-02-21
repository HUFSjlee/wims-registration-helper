package com.wims.server.application.service;

import com.wims.server.application.dto.SpeciesDtos;
import com.wims.server.application.usecase.SpeciesUseCase;
import com.wims.server.domain.port.SpeciesRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpeciesService implements SpeciesUseCase {
    private final SpeciesRepositoryPort speciesRepository;

    public SpeciesService(SpeciesRepositoryPort speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    @Override
    public List<SpeciesDtos.SpeciesResponse> search(String query) {
        return speciesRepository.search(query).stream()
                .map(s -> new SpeciesDtos.SpeciesResponse(
                        s.id(),
                        s.category(),
                        s.scientificName(),
                        s.koreanName(),
                        s.englishName()
                ))
                .toList();
    }
}
