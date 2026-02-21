package com.wims.server.infrastructure.web;

import com.wims.server.application.dto.SpeciesDtos;
import com.wims.server.application.usecase.SpeciesUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/species")
public class SpeciesController {
    private final SpeciesUseCase speciesUseCase;

    public SpeciesController(SpeciesUseCase speciesUseCase) {
        this.speciesUseCase = speciesUseCase;
    }

    @GetMapping("/search")
    public List<SpeciesDtos.SpeciesResponse> search(@RequestParam("q") String query) {
        return speciesUseCase.search(query);
    }
}
