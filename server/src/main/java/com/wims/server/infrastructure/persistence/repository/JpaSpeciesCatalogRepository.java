package com.wims.server.infrastructure.persistence.repository;

import com.wims.server.infrastructure.persistence.entity.SpeciesCatalogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JpaSpeciesCatalogRepository extends JpaRepository<SpeciesCatalogEntity, Long> {
    @Query("""
            select s from SpeciesCatalogEntity s
            where lower(s.koreanName) like lower(concat('%', :q, '%'))
               or lower(coalesce(s.englishName, '')) like lower(concat('%', :q, '%'))
               or lower(s.scientificName) like lower(concat('%', :q, '%'))
            order by s.koreanName asc
            """)
    List<SpeciesCatalogEntity> search(@Param("q") String q);
}
