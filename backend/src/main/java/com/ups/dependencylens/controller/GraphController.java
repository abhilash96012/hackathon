package com.ups.dependencylens.controller;

import com.ups.dependencylens.dto.GraphDataDto;
import com.ups.dependencylens.service.GraphTraversalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/graph")
@Tag(name = "Dependency Graph", description = "Endpoints for fetching graph nodes, edges, and component details")
public class GraphController {

    private final GraphTraversalService graphTraversalService;

    public GraphController(GraphTraversalService graphTraversalService) {
        this.graphTraversalService = graphTraversalService;
    }

    @GetMapping("/{datasetId}")
    @Operation(summary = "Get full ecosystem dependency graph data (nodes & edges)")
    public ResponseEntity<GraphDataDto> getGraphData(@PathVariable Long datasetId) {
        return ResponseEntity.ok(graphTraversalService.getGraphData(datasetId));
    }
}
