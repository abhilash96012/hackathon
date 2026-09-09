package com.ups.dependencylens.controller;

import com.ups.dependencylens.dto.ChangeImpactResultDto;
import com.ups.dependencylens.service.GraphTraversalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/impact")
@Tag(name = "Change Impact Analyzer", description = "Endpoints for analyzing modification impact & suggested test scopes")
public class ImpactController {

    private final GraphTraversalService graphTraversalService;

    public ImpactController(GraphTraversalService graphTraversalService) {
        this.graphTraversalService = graphTraversalService;
    }

    @GetMapping("/analyze")
    @Operation(summary = "Analyze direct/indirect change impact and recommend regression test scope")
    public ResponseEntity<ChangeImpactResultDto> analyzeImpact(
            @RequestParam Long datasetId,
            @RequestParam Long componentId) {
        return ResponseEntity.ok(graphTraversalService.analyzeChangeImpact(datasetId, componentId));
    }
}
