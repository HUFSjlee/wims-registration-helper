package com.wims.server.domain.model;

public record SpeciesCatalog(
        Long id,
        String category,
        String scientificName,
        String koreanName,
        String englishName
) {
}
