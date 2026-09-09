package com.ups.dependencylens.service;

import com.ups.dependencylens.dto.ChangeImpactResultDto;
import com.ups.dependencylens.dto.OutageSimulationResultDto;
import com.ups.dependencylens.model.*;
import com.ups.dependencylens.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GraphTraversalServiceTest {

    @Mock
    private ComponentNodeRepository componentRepository;

    @Mock
    private ComponentDependencyRepository dependencyRepository;

    @InjectMocks
    private GraphTraversalService graphTraversalService;

    private Dataset dataset;
    private ComponentNode authService;
    private ComponentNode customerService;
    private ComponentNode customerPortal;

    @BeforeEach
    void setUp() {
        dataset = Dataset.builder().id(1L).name("Test Dataset").build();

        authService = ComponentNode.builder().id(10L).dataset(dataset).name("Auth Service").type(ComponentType.API).build();
        customerService = ComponentNode.builder().id(11L).dataset(dataset).name("Customer Service").type(ComponentType.API).build();
        customerPortal = ComponentNode.builder().id(12L).dataset(dataset).name("Customer Portal").type(ComponentType.APPLICATION).build();
    }

    @Test
    void testOutageSimulation_CascadeImpact() {
        // Auth Service -> Customer Service -> Customer Portal
        ComponentDependency edge1 = ComponentDependency.builder().id(100L).dataset(dataset).sourceComponent(authService).targetComponent(customerService).build();
        ComponentDependency edge2 = ComponentDependency.builder().id(101L).dataset(dataset).sourceComponent(customerService).targetComponent(customerPortal).build();

        when(componentRepository.findById(10L)).thenReturn(Optional.of(authService));
        when(componentRepository.findByDatasetId(1L)).thenReturn(List.of(authService, customerService, customerPortal));
        when(dependencyRepository.findByDatasetId(1L)).thenReturn(List.of(edge1, edge2));

        OutageSimulationResultDto result = graphTraversalService.simulateOutage(1L, 10L);

        assertNotNull(result);
        assertEquals(10L, result.getFailedComponent().getId());
        assertEquals(2, result.getTotalImpactedCount()); // customerService + customerPortal
        assertTrue(result.getAffectedApplications().contains("Customer Portal"));
    }

    @Test
    void testChangeImpactAnalysis_TestScopeGeneration() {
        ComponentDependency edge1 = ComponentDependency.builder().id(100L).dataset(dataset).sourceComponent(authService).targetComponent(customerService).build();

        when(componentRepository.findById(10L)).thenReturn(Optional.of(authService));
        when(componentRepository.findByDatasetId(1L)).thenReturn(List.of(authService, customerService));
        when(dependencyRepository.findByDatasetId(1L)).thenReturn(List.of(edge1));

        ChangeImpactResultDto result = graphTraversalService.analyzeChangeImpact(1L, 10L);

        assertNotNull(result);
        assertEquals("Auth Service", result.getModifiedComponent().getName());
        assertFalse(result.getSuggestedTestScope().isEmpty());
    }
}
