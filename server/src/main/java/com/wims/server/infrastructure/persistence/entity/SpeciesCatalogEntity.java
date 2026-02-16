package com.wims.server.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "species_catalog")
public class SpeciesCatalogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, unique = true)
    private String scientificName;

    @Column(nullable = false)
    private String koreanName;

    private String englishName;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }
    public String getKoreanName() { return koreanName; }
    public void setKoreanName(String koreanName) { this.koreanName = koreanName; }
    public String getEnglishName() { return englishName; }
    public void setEnglishName(String englishName) { this.englishName = englishName; }
}
