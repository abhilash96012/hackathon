package com.ups.dependencylens.dto;

import java.util.List;

public class GraphDataDto {
    private Long datasetId;
    private String datasetName;
    private List<ComponentDto> nodes;
    private List<DependencyEdgeDto> edges;

    public GraphDataDto() {}

    public GraphDataDto(Long datasetId, String datasetName, List<ComponentDto> nodes, List<DependencyEdgeDto> edges) {
        this.datasetId = datasetId;
        this.datasetName = datasetName;
        this.nodes = nodes;
        this.edges = edges;
    }

    public Long getDatasetId() { return datasetId; }
    public void setDatasetId(Long datasetId) { this.datasetId = datasetId; }

    public String getDatasetName() { return datasetName; }
    public void setDatasetName(String datasetName) { this.datasetName = datasetName; }

    public List<ComponentDto> getNodes() { return nodes; }
    public void setNodes(List<ComponentDto> nodes) { this.nodes = nodes; }

    public List<DependencyEdgeDto> getEdges() { return edges; }
    public void setEdges(List<DependencyEdgeDto> edges) { this.edges = edges; }

    public static GraphDataDtoBuilder builder() {
        return new GraphDataDtoBuilder();
    }

    public static class GraphDataDtoBuilder {
        private Long datasetId;
        private String datasetName;
        private List<ComponentDto> nodes;
        private List<DependencyEdgeDto> edges;

        public GraphDataDtoBuilder datasetId(Long datasetId) { this.datasetId = datasetId; return this; }
        public GraphDataDtoBuilder datasetName(String datasetName) { this.datasetName = datasetName; return this; }
        public GraphDataDtoBuilder nodes(List<ComponentDto> nodes) { this.nodes = nodes; return this; }
        public GraphDataDtoBuilder edges(List<DependencyEdgeDto> edges) { this.edges = edges; return this; }

        public GraphDataDto build() {
            return new GraphDataDto(datasetId, datasetName, nodes, edges);
        }
    }
}
