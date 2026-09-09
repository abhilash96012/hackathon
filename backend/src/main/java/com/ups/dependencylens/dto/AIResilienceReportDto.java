package com.ups.dependencylens.dto;

import java.util.List;

public class AIResilienceReportDto {
    private String componentName;
    private int resilienceScore;
    private String riskLevel;
    private List<String> singlePointsOfFailure;
    private List<String> architecturalVulnerabilities;
    private List<String> recommendedMitigations;
    private String summaryText;

    public AIResilienceReportDto() {}

    public AIResilienceReportDto(String componentName, int resilienceScore, String riskLevel, List<String> singlePointsOfFailure, List<String> architecturalVulnerabilities, List<String> recommendedMitigations, String summaryText) {
        this.componentName = componentName;
        this.resilienceScore = resilienceScore;
        this.riskLevel = riskLevel;
        this.singlePointsOfFailure = singlePointsOfFailure;
        this.architecturalVulnerabilities = architecturalVulnerabilities;
        this.recommendedMitigations = recommendedMitigations;
        this.summaryText = summaryText;
    }

    public String getComponentName() { return componentName; }
    public void setComponentName(String componentName) { this.componentName = componentName; }

    public int getResilienceScore() { return resilienceScore; }
    public void setResilienceScore(int resilienceScore) { this.resilienceScore = resilienceScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public List<String> getSinglePointsOfFailure() { return singlePointsOfFailure; }
    public void setSinglePointsOfFailure(List<String> singlePointsOfFailure) { this.singlePointsOfFailure = singlePointsOfFailure; }

    public List<String> getArchitecturalVulnerabilities() { return architecturalVulnerabilities; }
    public void setArchitecturalVulnerabilities(List<String> architecturalVulnerabilities) { this.architecturalVulnerabilities = architecturalVulnerabilities; }

    public List<String> getRecommendedMitigations() { return recommendedMitigations; }
    public void setRecommendedMitigations(List<String> recommendedMitigations) { this.recommendedMitigations = recommendedMitigations; }

    public String getSummaryText() { return summaryText; }
    public void setSummaryText(String summaryText) { this.summaryText = summaryText; }

    public static AIResilienceReportDtoBuilder builder() {
        return new AIResilienceReportDtoBuilder();
    }

    public static class AIResilienceReportDtoBuilder {
        private String componentName;
        private int resilienceScore;
        private String riskLevel;
        private List<String> singlePointsOfFailure;
        private List<String> architecturalVulnerabilities;
        private List<String> recommendedMitigations;
        private String summaryText;

        public AIResilienceReportDtoBuilder componentName(String componentName) { this.componentName = componentName; return this; }
        public AIResilienceReportDtoBuilder resilienceScore(int resilienceScore) { this.resilienceScore = resilienceScore; return this; }
        public AIResilienceReportDtoBuilder riskLevel(String riskLevel) { this.riskLevel = riskLevel; return this; }
        public AIResilienceReportDtoBuilder singlePointsOfFailure(List<String> singlePointsOfFailure) { this.singlePointsOfFailure = singlePointsOfFailure; return this; }
        public AIResilienceReportDtoBuilder architecturalVulnerabilities(List<String> architecturalVulnerabilities) { this.architecturalVulnerabilities = architecturalVulnerabilities; return this; }
        public AIResilienceReportDtoBuilder recommendedMitigations(List<String> recommendedMitigations) { this.recommendedMitigations = recommendedMitigations; return this; }
        public AIResilienceReportDtoBuilder summaryText(String summaryText) { this.summaryText = summaryText; return this; }

        public AIResilienceReportDto build() {
            return new AIResilienceReportDto(componentName, resilienceScore, riskLevel, singlePointsOfFailure, architecturalVulnerabilities, recommendedMitigations, summaryText);
        }
    }
}
