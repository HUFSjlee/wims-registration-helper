package com.wims.server.application.dto;

public final class SpeciesDtos {
    private SpeciesDtos() {
    }

    public record SpeciesResponse(
            Long id,
            String category,
            String scientificName,
            String koreanName,
            String englishName
    ) {
    }
}
