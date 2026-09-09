package com.ups.dependencylens.repository;

import com.ups.dependencylens.model.ComponentDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentDependencyRepository extends JpaRepository<ComponentDependency, Long> {
    List<ComponentDependency> findByDatasetId(Long datasetId);
    
    // Find all outgoing dependencies (what targetComponent depends on)
    List<ComponentDependency> findByDatasetIdAndTargetComponentId(Long datasetId, Long targetComponentId);
    
    // Find all incoming dependencies (what relies on sourceComponent as consumers)
    List<ComponentDependency> findByDatasetIdAndSourceComponentId(Long datasetId, Long sourceComponentId);
    
    long countByDatasetId(Long datasetId);

    void deleteByDatasetId(Long datasetId);
}
