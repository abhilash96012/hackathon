package com.ups.dependencylens.dto;

public class EcosystemMetricsDto {
    private long totalServices;
    private long totalApplications;
    private long totalDatabases;
    private long totalExternalSystems;
    private long totalComponents;
    private long totalDependencies;
    private String mostConnectedService;
    private String criticalServiceCandidate;
    private String largestBlastRadiusCandidate;
    private double averageDependencyDepth;

    public EcosystemMetricsDto() {}

    public EcosystemMetricsDto(long totalServices, long totalApplications, long totalDatabases, long totalExternalSystems, long totalComponents, long totalDependencies, String mostConnectedService, String criticalServiceCandidate, String largestBlastRadiusCandidate, double averageDependencyDepth) {
        this.totalServices = totalServices;
        this.totalApplications = totalApplications;
        this.totalDatabases = totalDatabases;
        this.totalExternalSystems = totalExternalSystems;
        this.totalComponents = totalComponents;
        this.totalDependencies = totalDependencies;
        this.mostConnectedService = mostConnectedService;
        this.criticalServiceCandidate = criticalServiceCandidate;
        this.largestBlastRadiusCandidate = largestBlastRadiusCandidate;
        this.averageDependencyDepth = averageDependencyDepth;
    }

    public long getTotalServices() { return totalServices; }
    public void setTotalServices(long totalServices) { this.totalServices = totalServices; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getTotalDatabases() { return totalDatabases; }
    public void setTotalDatabases(long totalDatabases) { this.totalDatabases = totalDatabases; }

    public long getTotalExternalSystems() { return totalExternalSystems; }
    public void setTotalExternalSystems(long totalExternalSystems) { this.totalExternalSystems = totalExternalSystems; }

    public long getTotalComponents() { return totalComponents; }
    public void setTotalComponents(long totalComponents) { this.totalComponents = totalComponents; }

    public long getTotalDependencies() { return totalDependencies; }
    public void setTotalDependencies(long totalDependencies) { this.totalDependencies = totalDependencies; }

    public String getMostConnectedService() { return mostConnectedService; }
    public void setMostConnectedService(String mostConnectedService) { this.mostConnectedService = mostConnectedService; }

    public String getCriticalServiceCandidate() { return criticalServiceCandidate; }
    public void setCriticalServiceCandidate(String criticalServiceCandidate) { this.criticalServiceCandidate = criticalServiceCandidate; }

    public String getLargestBlastRadiusCandidate() { return largestBlastRadiusCandidate; }
    public void setLargestBlastRadiusCandidate(String largestBlastRadiusCandidate) { this.largestBlastRadiusCandidate = largestBlastRadiusCandidate; }

    public double getAverageDependencyDepth() { return averageDependencyDepth; }
    public void setAverageDependencyDepth(double averageDependencyDepth) { this.averageDependencyDepth = averageDependencyDepth; }

    public static EcosystemMetricsDtoBuilder builder() {
        return new EcosystemMetricsDtoBuilder();
    }

    public static class EcosystemMetricsDtoBuilder {
        private long totalServices;
        private long totalApplications;
        private long totalDatabases;
        private long totalExternalSystems;
        private long totalComponents;
        private long totalDependencies;
        private String mostConnectedService;
        private String criticalServiceCandidate;
        private String largestBlastRadiusCandidate;
        private double averageDependencyDepth;

        public EcosystemMetricsDtoBuilder totalServices(long totalServices) { this.totalServices = totalServices; return this; }
        public EcosystemMetricsDtoBuilder totalApplications(long totalApplications) { this.totalApplications = totalApplications; return this; }
        public EcosystemMetricsDtoBuilder totalDatabases(long totalDatabases) { this.totalDatabases = totalDatabases; return this; }
        public EcosystemMetricsDtoBuilder totalExternalSystems(long totalExternalSystems) { this.totalExternalSystems = totalExternalSystems; return this; }
        public EcosystemMetricsDtoBuilder totalComponents(long totalComponents) { this.totalComponents = totalComponents; return this; }
        public EcosystemMetricsDtoBuilder totalDependencies(long totalDependencies) { this.totalDependencies = totalDependencies; return this; }
        public EcosystemMetricsDtoBuilder mostConnectedService(String mostConnectedService) { this.mostConnectedService = mostConnectedService; return this; }
        public EcosystemMetricsDtoBuilder criticalServiceCandidate(String criticalServiceCandidate) { this.criticalServiceCandidate = criticalServiceCandidate; return this; }
        public EcosystemMetricsDtoBuilder largestBlastRadiusCandidate(String largestBlastRadiusCandidate) { this.largestBlastRadiusCandidate = largestBlastRadiusCandidate; return this; }
        public EcosystemMetricsDtoBuilder averageDependencyDepth(double averageDependencyDepth) { this.averageDependencyDepth = averageDependencyDepth; return this; }

        public EcosystemMetricsDto build() {
            return new EcosystemMetricsDto(totalServices, totalApplications, totalDatabases, totalExternalSystems, totalComponents, totalDependencies, mostConnectedService, criticalServiceCandidate, largestBlastRadiusCandidate, averageDependencyDepth);
        }
    }
}
