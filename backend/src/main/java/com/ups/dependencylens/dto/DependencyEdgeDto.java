package com.ups.dependencylens.dto;

public class DependencyEdgeDto {
    private Long id;
    private Long sourceComponentId;
    private String sourceComponentName;
    private Long targetComponentId;
    private String targetComponentName;
    private String dependencyType;

    public DependencyEdgeDto() {}

    public DependencyEdgeDto(Long id, Long sourceComponentId, String sourceComponentName, Long targetComponentId, String targetComponentName, String dependencyType) {
        this.id = id;
        this.sourceComponentId = sourceComponentId;
        this.sourceComponentName = sourceComponentName;
        this.targetComponentId = targetComponentId;
        this.targetComponentName = targetComponentName;
        this.dependencyType = dependencyType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceComponentId() { return sourceComponentId; }
    public void setSourceComponentId(Long sourceComponentId) { this.sourceComponentId = sourceComponentId; }

    public String getSourceComponentName() { return sourceComponentName; }
    public void setSourceComponentName(String sourceComponentName) { this.sourceComponentName = sourceComponentName; }

    public Long getTargetComponentId() { return targetComponentId; }
    public void setTargetComponentId(Long targetComponentId) { this.targetComponentId = targetComponentId; }

    public String getTargetComponentName() { return targetComponentName; }
    public void setTargetComponentName(String targetComponentName) { this.targetComponentName = targetComponentName; }

    public String getDependencyType() { return dependencyType; }
    public void setDependencyType(String dependencyType) { this.dependencyType = dependencyType; }

    public static DependencyEdgeDtoBuilder builder() {
        return new DependencyEdgeDtoBuilder();
    }

    public static class DependencyEdgeDtoBuilder {
        private Long id;
        private Long sourceComponentId;
        private String sourceComponentName;
        private Long targetComponentId;
        private String targetComponentName;
        private String dependencyType;

        public DependencyEdgeDtoBuilder id(Long id) { this.id = id; return this; }
        public DependencyEdgeDtoBuilder sourceComponentId(Long sourceComponentId) { this.sourceComponentId = sourceComponentId; return this; }
        public DependencyEdgeDtoBuilder sourceComponentName(String sourceComponentName) { this.sourceComponentName = sourceComponentName; return this; }
        public DependencyEdgeDtoBuilder targetComponentId(Long targetComponentId) { this.targetComponentId = targetComponentId; return this; }
        public DependencyEdgeDtoBuilder targetComponentName(String targetComponentName) { this.targetComponentName = targetComponentName; return this; }
        public DependencyEdgeDtoBuilder dependencyType(String dependencyType) { this.dependencyType = dependencyType; return this; }

        public DependencyEdgeDto build() {
            return new DependencyEdgeDto(id, sourceComponentId, sourceComponentName, targetComponentId, targetComponentName, dependencyType);
        }
    }
}
