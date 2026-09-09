package com.ups.dependencylens.dto;

import java.util.List;

public class ChangeImpactResultDto {
    private ComponentDto modifiedComponent;
    private List<ComponentDto> directImpact;
    private List<ComponentDto> indirectImpact;
    private List<String> affectedApplications;
    private List<String> suggestedTestScope;
    private String riskLevel;
    private String rationale;

    public ChangeImpactResultDto() {}

    public ChangeImpactResultDto(ComponentDto modifiedComponent, List<ComponentDto> directImpact, List<ComponentDto> indirectImpact, List<String> affectedApplications, List<String> suggestedTestScope, String riskLevel, String rationale) {
        this.modifiedComponent = modifiedComponent;
        this.directImpact = directImpact;
        this.indirectImpact = indirectImpact;
        this.affectedApplications = affectedApplications;
        this.suggestedTestScope = suggestedTestScope;
        this.riskLevel = riskLevel;
        this.rationale = rationale;
    }

    public ComponentDto getModifiedComponent() { return modifiedComponent; }
    public void setModifiedComponent(ComponentDto modifiedComponent) { this.modifiedComponent = modifiedComponent; }

    public List<ComponentDto> getDirectImpact() { return directImpact; }
    public void setDirectImpact(List<ComponentDto> directImpact) { this.directImpact = directImpact; }

    public List<ComponentDto> getIndirectImpact() { return indirectImpact; }
    public void setIndirectImpact(List<ComponentDto> indirectImpact) { this.indirectImpact = indirectImpact; }

    public List<String> getAffectedApplications() { return affectedApplications; }
    public void setAffectedApplications(List<String> affectedApplications) { this.affectedApplications = affectedApplications; }

    public List<String> getSuggestedTestScope() { return suggestedTestScope; }
    public void setSuggestedTestScope(List<String> suggestedTestScope) { this.suggestedTestScope = suggestedTestScope; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public static ChangeImpactResultDtoBuilder builder() {
        return new ChangeImpactResultDtoBuilder();
    }

    public static class ChangeImpactResultDtoBuilder {
        private ComponentDto modifiedComponent;
        private List<ComponentDto> directImpact;
        private List<ComponentDto> indirectImpact;
        private List<String> affectedApplications;
        private List<String> suggestedTestScope;
        private String riskLevel;
        private String rationale;

        public ChangeImpactResultDtoBuilder modifiedComponent(ComponentDto modifiedComponent) { this.modifiedComponent = modifiedComponent; return this; }
        public ChangeImpactResultDtoBuilder directImpact(List<ComponentDto> directImpact) { this.directImpact = directImpact; return this; }
        public ChangeImpactResultDtoBuilder indirectImpact(List<ComponentDto> indirectImpact) { this.indirectImpact = indirectImpact; return this; }
        public ChangeImpactResultDtoBuilder affectedApplications(List<String> affectedApplications) { this.affectedApplications = affectedApplications; return this; }
        public ChangeImpactResultDtoBuilder suggestedTestScope(List<String> suggestedTestScope) { this.suggestedTestScope = suggestedTestScope; return this; }
        public ChangeImpactResultDtoBuilder riskLevel(String riskLevel) { this.riskLevel = riskLevel; return this; }
        public ChangeImpactResultDtoBuilder rationale(String rationale) { this.rationale = rationale; return this; }

        public ChangeImpactResultDto build() {
            return new ChangeImpactResultDto(modifiedComponent, directImpact, indirectImpact, affectedApplications, suggestedTestScope, riskLevel, rationale);
        }
    }
}
