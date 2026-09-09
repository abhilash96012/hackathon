package com.ups.dependencylens.service;

import com.ups.dependencylens.model.*;
import com.ups.dependencylens.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.yaml.snakeyaml.Yaml;

import java.util.*;

@Service
public class YamlIngestionService {

    private final DatasetRepository datasetRepository;
    private final ComponentNodeRepository componentRepository;
    private final ComponentDependencyRepository dependencyRepository;

    public YamlIngestionService(DatasetRepository datasetRepository, ComponentNodeRepository componentRepository, ComponentDependencyRepository dependencyRepository) {
        this.datasetRepository = datasetRepository;
        this.componentRepository = componentRepository;
        this.dependencyRepository = dependencyRepository;
    }

    @Transactional
    public Dataset ingestYamlDataset(String datasetName, String description, List<String> yamlContents) {
        Dataset dataset = datasetRepository.findByName(datasetName)
                .orElseGet(() -> datasetRepository.save(Dataset.builder()
                        .name(datasetName)
                        .description(description)
                        .isDefault(false)
                        .build()));

        Yaml yaml = new Yaml();
        Map<String, Map<String, Object>> parsedYamlMap = new HashMap<>();

        for (String yamlContent : yamlContents) {
            Iterable<Object> documents = yaml.loadAll(yamlContent);
            for (Object doc : documents) {
                if (doc instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> map = (Map<String, Object>) doc;
                    String serviceName = (String) map.getOrDefault("service", map.get("name"));
                    if (serviceName != null) {
                        parsedYamlMap.put(serviceName.trim(), map);
                    }
                }
            }
        }

        // Pass 1: Upsert all Component Nodes
        Map<String, ComponentNode> nodeMap = new HashMap<>();
        for (Map.Entry<String, Map<String, Object>> entry : parsedYamlMap.entrySet()) {
            String name = entry.getKey();
            Map<String, Object> data = entry.getValue();

            String typeStr = (String) data.getOrDefault("type", "API");
            ComponentType type = parseComponentType(typeStr);

            String desc = (String) data.getOrDefault("description", "Imported via YAML");
            String owner = (String) data.getOrDefault("owner", "Engineering");

            ComponentNode node = componentRepository.findByDatasetIdAndNameIgnoreCase(dataset.getId(), name)
                    .orElseGet(() -> ComponentNode.builder()
                            .dataset(dataset)
                            .name(name)
                            .type(type)
                            .description(desc)
                            .teamOwner(owner)
                            .criticalityScore(1.0)
                            .build());

            node.setType(type);
            node.setDescription(desc);
            node.setTeamOwner(owner);
            nodeMap.put(name.toLowerCase(), componentRepository.save(node));
        }

        // Pass 2: Ingest Dependencies and Consumers
        for (Map.Entry<String, Map<String, Object>> entry : parsedYamlMap.entrySet()) {
            String targetName = entry.getKey();
            Map<String, Object> data = entry.getValue();
            ComponentNode targetNode = nodeMap.get(targetName.toLowerCase());

            if (targetNode == null) continue;

            // Direct Dependencies: targetNode depends on sourceNode
            @SuppressWarnings("unchecked")
            List<String> dependencies = (List<String>) data.get("dependencies");
            if (dependencies != null) {
                for (String depName : dependencies) {
                    ComponentNode sourceNode = getOrCreateNode(dataset, nodeMap, depName);
                    createDependencyIfAbsent(dataset, sourceNode, targetNode, "STRICT");
                }
            }

            // Consumers: consumerNode depends on targetNode
            @SuppressWarnings("unchecked")
            List<String> consumers = (List<String>) data.get("consumers");
            if (consumers != null) {
                for (String consumerName : consumers) {
                    ComponentNode consumerNode = getOrCreateNode(dataset, nodeMap, consumerName);
                    createDependencyIfAbsent(dataset, targetNode, consumerNode, "STRICT");
                }
            }
        }

        return dataset;
    }

    private ComponentNode getOrCreateNode(Dataset dataset, Map<String, ComponentNode> nodeMap, String name) {
        String key = name.trim().toLowerCase();
        if (nodeMap.containsKey(key)) {
            return nodeMap.get(key);
        }

        ComponentType inferredType = inferTypeByName(name);
        ComponentNode node = componentRepository.findByDatasetIdAndNameIgnoreCase(dataset.getId(), name)
                .orElseGet(() -> ComponentNode.builder()
                        .dataset(dataset)
                        .name(name.trim())
                        .type(inferredType)
                        .description("Implicit component from YAML link")
                        .teamOwner("System")
                        .criticalityScore(1.0)
                        .build());

        ComponentNode saved = componentRepository.save(node);
        nodeMap.put(key, saved);
        return saved;
    }

    private void createDependencyIfAbsent(Dataset dataset, ComponentNode source, ComponentNode target, String depType) {
        List<ComponentDependency> existing = dependencyRepository.findByDatasetIdAndTargetComponentId(dataset.getId(), target.getId());
        boolean exists = existing.stream().anyMatch(d -> d.getSourceComponent().getId().equals(source.getId()));

        if (!exists) {
            dependencyRepository.save(ComponentDependency.builder()
                    .dataset(dataset)
                    .sourceComponent(source)
                    .targetComponent(target)
                    .dependencyType(depType)
                    .build());
        }
    }

    private ComponentType parseComponentType(String typeStr) {
        if (typeStr == null) return ComponentType.API;
        String upper = typeStr.trim().toUpperCase();
        if (upper.contains("APP") || upper.contains("CONSOLE") || upper.contains("PORTAL") || upper.contains("MOBILE")) {
            return ComponentType.APPLICATION;
        } else if (upper.contains("DB") || upper.contains("DATABASE") || upper.contains("DATASTORE")) {
            return ComponentType.DATABASE;
        } else if (upper.contains("EXTERNAL") || upper.contains("GATEWAY") || upper.contains("THIRD_PARTY")) {
            return ComponentType.EXTERNAL_SYSTEM;
        }
        return ComponentType.API;
    }

    private ComponentType inferTypeByName(String name) {
        String lower = name.toLowerCase();
        if (lower.contains("db") || lower.contains("database")) return ComponentType.DATABASE;
        if (lower.contains("app") || lower.contains("portal") || lower.contains("console") || lower.contains("dashboard")) return ComponentType.APPLICATION;
        if (lower.contains("gateway") || lower.contains("external") || lower.contains("stripe") || lower.contains("paypal")) return ComponentType.EXTERNAL_SYSTEM;
        return ComponentType.API;
    }
}
