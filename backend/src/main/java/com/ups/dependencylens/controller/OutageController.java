package com.ups.dependencylens.controller;

import com.ups.dependencylens.dto.OutageSimulationResultDto;
import com.ups.dependencylens.service.GraphTraversalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/outage")
@Tag(name = "Outage Simulator", description = "Endpoints for simulating component failure & blast radius analysis")
public class OutageController {

    private final GraphTraversalService graphTraversalService;

    public OutageController(GraphTraversalService graphTraversalService) {
        this.graphTraversalService = graphTraversalService;
    }

    @GetMapping("/simulate")
    @Operation(summary = "Simulate service failure and calculate blast radius & impacted applications")
    public ResponseEntity<OutageSimulationResultDto> simulateOutage(
            @RequestParam Long datasetId,
            @RequestParam Long componentId) {
        return ResponseEntity.ok(graphTraversalService.simulateOutage(datasetId, componentId));
    }
}
