package com.ups.dependencylens.controller;

import com.ups.dependencylens.model.Dataset;
import com.ups.dependencylens.repository.DatasetRepository;
import com.ups.dependencylens.service.YamlIngestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/datasets")
@Tag(name = "Dataset Management", description = "Endpoints for managing YAML dependency datasets")
public class DatasetController {

    private final DatasetRepository datasetRepository;
    private final YamlIngestionService yamlIngestionService;

    public DatasetController(DatasetRepository datasetRepository, YamlIngestionService yamlIngestionService) {
        this.datasetRepository = datasetRepository;
        this.yamlIngestionService = yamlIngestionService;
    }

    @GetMapping
    @Operation(summary = "Get all available datasets")
    public ResponseEntity<List<Dataset>> getAllDatasets() {
        return ResponseEntity.ok(datasetRepository.findAll());
    }

    @GetMapping("/default")
    @Operation(summary = "Get default dataset")
    public ResponseEntity<Dataset> getDefaultDataset() {
        return datasetRepository.findByIsDefaultTrue()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(datasetRepository.findAll().stream().findFirst().orElse(null)));
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload and ingest custom YAML dependency file(s)")
    public ResponseEntity<Dataset> uploadYamlDataset(@RequestBody YamlUploadRequest request) {
        Dataset dataset = yamlIngestionService.ingestYamlDataset(request.getDatasetName(), request.getDescription(), request.getYamlContents());
        return ResponseEntity.ok(dataset);
    }

    public static class YamlUploadRequest {
        private String datasetName;
        private String description;
        private List<String> yamlContents;

        public YamlUploadRequest() {}

        public YamlUploadRequest(String datasetName, String description, List<String> yamlContents) {
            this.datasetName = datasetName;
            this.description = description;
            this.yamlContents = yamlContents;
        }

        public String getDatasetName() { return datasetName; }
        public void setDatasetName(String datasetName) { this.datasetName = datasetName; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public List<String> getYamlContents() { return yamlContents; }
        public void setYamlContents(List<String> yamlContents) { this.yamlContents = yamlContents; }
    }
}
