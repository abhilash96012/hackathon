package com.ups.dependencylens.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "components")
public class ComponentNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dataset_id", nullable = false)
    private Dataset dataset;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComponentType type;

    @Column(length = 1000)
    private String description;

    @Column(name = "team_owner")
    private String teamOwner;

    @Column(name = "criticality_score")
    private Double criticalityScore = 1.0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ComponentNode() {}

    public ComponentNode(Long id, Dataset dataset, String name, ComponentType type, String description, String teamOwner, Double criticalityScore, LocalDateTime createdAt) {
        this.id = id;
        this.dataset = dataset;
        this.name = name;
        this.type = type;
        this.description = description;
        this.teamOwner = teamOwner;
        this.criticalityScore = criticalityScore != null ? criticalityScore : 1.0;
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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ComponentType getType() { return type; }
    public void setType(ComponentType type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTeamOwner() { return teamOwner; }
    public void setTeamOwner(String teamOwner) { this.teamOwner = teamOwner; }

    public Double getCriticalityScore() { return criticalityScore; }
    public void setCriticalityScore(Double criticalityScore) { this.criticalityScore = criticalityScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ComponentNodeBuilder builder() {
        return new ComponentNodeBuilder();
    }

    public static class ComponentNodeBuilder {
        private Long id;
        private Dataset dataset;
        private String name;
        private ComponentType type;
        private String description;
        private String teamOwner;
        private Double criticalityScore = 1.0;
        private LocalDateTime createdAt;

        public ComponentNodeBuilder id(Long id) { this.id = id; return this; }
        public ComponentNodeBuilder dataset(Dataset dataset) { this.dataset = dataset; return this; }
        public ComponentNodeBuilder name(String name) { this.name = name; return this; }
        public ComponentNodeBuilder type(ComponentType type) { this.type = type; return this; }
        public ComponentNodeBuilder description(String description) { this.description = description; return this; }
        public ComponentNodeBuilder teamOwner(String teamOwner) { this.teamOwner = teamOwner; return this; }
        public ComponentNodeBuilder criticalityScore(Double criticalityScore) { this.criticalityScore = criticalityScore; return this; }
        public ComponentNodeBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ComponentNode build() {
            return new ComponentNode(id, dataset, name, type, description, teamOwner, criticalityScore, createdAt);
        }
    }
}
