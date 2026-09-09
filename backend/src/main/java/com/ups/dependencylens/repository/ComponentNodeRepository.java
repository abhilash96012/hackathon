package com.ups.dependencylens.repository;

import com.ups.dependencylens.model.ComponentNode;
import com.ups.dependencylens.model.ComponentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentNodeRepository extends JpaRepository<ComponentNode, Long> {
    List<ComponentNode> findByDatasetId(Long datasetId);
    Optional<ComponentNode> findByDatasetIdAndNameIgnoreCase(Long datasetId, String name);
    List<ComponentNode> findByDatasetIdAndType(Long datasetId, ComponentType type);
    long countByDatasetId(Long datasetId);
    long countByDatasetIdAndType(Long datasetId, ComponentType type);
}
