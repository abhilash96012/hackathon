package com.ups.dependencylens.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "component_dependencies", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"dataset_id", "source_component_id", "target_component_id"})
})
public class ComponentDependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dataset_id", nullable = false)
    private Dataset dataset;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_component_id", nullable = false)
    private ComponentNode sourceComponent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_component_id", nullable = false)
    private ComponentNode targetComponent;

    @Column(name = "dependency_type")
    private String dependencyType = "STRICT";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ComponentDependency() {}

    public ComponentDependency(Long id, Dataset dataset, ComponentNode sourceComponent, ComponentNode targetComponent, String dependencyType, LocalDateTime createdAt) {
        this.id = id;
        this.dataset = dataset;
        this.sourceComponent = sourceComponent;
        this.targetComponent = targetComponent;
        this.dependencyType = dependencyType != null ? dependencyType : "STRICT";
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Dataset getDataset() { return dataset; }
    public void setDataset(Dataset dataset) { this.dataset = dataset; }

    public ComponentNode getSourceComponent() { return sourceComponent; }
    public void setSourceComponent(ComponentNode sourceComponent) { this.sourceComponent = sourceComponent; }

    public ComponentNode getTargetComponent() { return targetComponent; }
    public void setTargetComponent(ComponentNode targetComponent) { this.targetComponent = targetComponent; }

    public String getDependencyType() { return dependencyType; }
    public void setDependencyType(String dependencyType) { this.dependencyType = dependencyType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ComponentDependencyBuilder builder() {
        return new ComponentDependencyBuilder();
    }

    public static class ComponentDependencyBuilder {
        private Long id;
        private Dataset dataset;
        private ComponentNode sourceComponent;
        private ComponentNode targetComponent;
        private String dependencyType = "STRICT";
        private LocalDateTime createdAt;

        public ComponentDependencyBuilder id(Long id) { this.id = id; return this; }
        public ComponentDependencyBuilder dataset(Dataset dataset) { this.dataset = dataset; return this; }
        public ComponentDependencyBuilder sourceComponent(ComponentNode sourceComponent) { this.sourceComponent = sourceComponent; return this; }
        public ComponentDependencyBuilder targetComponent(ComponentNode targetComponent) { this.targetComponent = targetComponent; return this; }
        public ComponentDependencyBuilder dependencyType(String dependencyType) { this.dependencyType = dependencyType; return this; }
        public ComponentDependencyBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ComponentDependency build() {
            return new ComponentDependency(id, dataset, sourceComponent, targetComponent, dependencyType, createdAt);
        }
    }
}
