package com.ups.dependencylens.controller;

import com.ups.dependencylens.dto.AIResilienceReportDto;
import com.ups.dependencylens.service.AIResilienceAdvisorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai-resilience")
@Tag(name = "AI Resilience Advisor", description = "Endpoints for generating AI-assisted vulnerability and mitigation reports")
public class AIResilienceController {

    private final AIResilienceAdvisorService aiResilienceAdvisorService;

    public AIResilienceController(AIResilienceAdvisorService aiResilienceAdvisorService) {
        this.aiResilienceAdvisorService = aiResilienceAdvisorService;
    }

    @GetMapping("/audit")
    @Operation(summary = "Generate AI Resilience Audit Report for a specific component")
    public ResponseEntity<AIResilienceReportDto> generateAuditReport(
            @RequestParam Long datasetId,
            @RequestParam Long componentId) {
        return ResponseEntity.ok(aiResilienceAdvisorService.generateResilienceReport(datasetId, componentId));
    }
}
