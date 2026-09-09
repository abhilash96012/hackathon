package com.ups.dependencylens.dto;

import com.ups.dependencylens.model.ComponentType;

public class ComponentDto {
    private Long id;
    private String name;
    private ComponentType type;
    private String description;
    private String teamOwner;
    private Double criticalityScore;
    private int incomingDegree;
    private int outgoingDegree;

    public ComponentDto() {}

    public ComponentDto(Long id, String name, ComponentType type, String description, String teamOwner, Double criticalityScore, int incomingDegree, int outgoingDegree) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.teamOwner = teamOwner;
        this.criticalityScore = criticalityScore;
        this.incomingDegree = incomingDegree;
        this.outgoingDegree = outgoingDegree;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public int getIncomingDegree() { return incomingDegree; }
    public void setIncomingDegree(int incomingDegree) { this.incomingDegree = incomingDegree; }

    public int getOutgoingDegree() { return outgoingDegree; }
    public void setOutgoingDegree(int outgoingDegree) { this.outgoingDegree = outgoingDegree; }

    public static ComponentDtoBuilder builder() {
        return new ComponentDtoBuilder();
    }

    public static class ComponentDtoBuilder {
        private Long id;
        private String name;
        private ComponentType type;
        private String description;
        private String teamOwner;
        private Double criticalityScore;
        private int incomingDegree;
        private int outgoingDegree;

        public ComponentDtoBuilder id(Long id) { this.id = id; return this; }
        public ComponentDtoBuilder name(String name) { this.name = name; return this; }
        public ComponentDtoBuilder type(ComponentType type) { this.type = type; return this; }
        public ComponentDtoBuilder description(String description) { this.description = description; return this; }
        public ComponentDtoBuilder teamOwner(String teamOwner) { this.teamOwner = teamOwner; return this; }
        public ComponentDtoBuilder criticalityScore(Double criticalityScore) { this.criticalityScore = criticalityScore; return this; }
        public ComponentDtoBuilder incomingDegree(int incomingDegree) { this.incomingDegree = incomingDegree; return this; }
        public ComponentDtoBuilder outgoingDegree(int outgoingDegree) { this.outgoingDegree = outgoingDegree; return this; }

        public ComponentDto build() {
            return new ComponentDto(id, name, type, description, teamOwner, criticalityScore, incomingDegree, outgoingDegree);
        }
    }
}
