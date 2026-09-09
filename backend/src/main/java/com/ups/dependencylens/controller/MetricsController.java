package com.ups.dependencylens.controller;

import com.ups.dependencylens.dto.EcosystemMetricsDto;
import com.ups.dependencylens.service.EcosystemMetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/metrics")
@Tag(name = "Ecosystem Analytics", description = "Endpoints for calculating dashboard metrics & centrality rankings")
public class MetricsController {

    private final EcosystemMetricsService ecosystemMetricsService;

    public MetricsController(EcosystemMetricsService ecosystemMetricsService) {
        this.ecosystemMetricsService = ecosystemMetricsService;
    }

    @GetMapping("/{datasetId}")
    @Operation(summary = "Calculate summary metrics, total counts, and criticality candidates")
    public ResponseEntity<EcosystemMetricsDto> getMetrics(@PathVariable Long datasetId) {
        return ResponseEntity.ok(ecosystemMetricsService.calculateMetrics(datasetId));
    }
}
