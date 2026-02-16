package com.wims.server.application.usecase;

import com.wims.server.application.dto.SpeciesDtos;

import java.util.List;

public interface SpeciesUseCase {
    List<SpeciesDtos.SpeciesResponse> search(String query);
}
