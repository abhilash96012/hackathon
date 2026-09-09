package com.ups.dependencylens.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "datasets")
public class Dataset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Dataset() {}

    public Dataset(Long id, String name, String description, Boolean isDefault, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isDefault = isDefault != null ? isDefault : false;
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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static DatasetBuilder builder() {
        return new DatasetBuilder();
    }

    public static class DatasetBuilder {
        private Long id;
        private String name;
        private String description;
        private Boolean isDefault = false;
        private LocalDateTime createdAt;

        public DatasetBuilder id(Long id) { this.id = id; return this; }
        public DatasetBuilder name(String name) { this.name = name; return this; }
        public DatasetBuilder description(String description) { this.description = description; return this; }
        public DatasetBuilder isDefault(Boolean isDefault) { this.isDefault = isDefault; return this; }
        public DatasetBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Dataset build() {
            return new Dataset(id, name, description, isDefault, createdAt);
        }
    }
}
