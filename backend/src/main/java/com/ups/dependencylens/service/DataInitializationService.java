package com.ups.dependencylens.service;

import com.ups.dependencylens.model.*;
import com.ups.dependencylens.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DataInitializationService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializationService.class);

    private final DatasetRepository datasetRepository;
    private final ComponentNodeRepository componentRepository;
    private final ComponentDependencyRepository dependencyRepository;

    public DataInitializationService(DatasetRepository datasetRepository, ComponentNodeRepository componentRepository, ComponentDependencyRepository dependencyRepository) {
        this.datasetRepository = datasetRepository;
        this.componentRepository = componentRepository;
        this.dependencyRepository = dependencyRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (datasetRepository.findByName("UPS Enterprise Logistics Ecosystem").isPresent()) {
            log.info("Default UPS Enterprise dataset already initialized.");
            return;
        }

        log.info("Initializing default UPS Enterprise Logistics Ecosystem dataset...");

        Dataset dataset = datasetRepository.save(Dataset.builder()
                .name("UPS Enterprise Logistics Ecosystem")
                .description("Simulated UPS Enterprise Microservices, APIs, Databases, Applications, and External Integrations")
                .isDefault(true)
                .build());

        // Create Components
        Map<String, ComponentNode> nodes = new HashMap<>();

        // Core APIs
        nodes.put("Auth Service", createNode(dataset, "Auth Service", ComponentType.API, "Central Identity & OAuth2 Provider", "Security Team", 9.5));
        nodes.put("Customer Service", createNode(dataset, "Customer Service", ComponentType.API, "Customer Profile & Account Management", "Customer Experience Team", 8.0));
        nodes.put("Payment Service", createNode(dataset, "Payment Service", ComponentType.API, "Payment Processing & Tokenization", "Billing Team", 9.0));
        nodes.put("Product Catalog Service", createNode(dataset, "Product Catalog Service", ComponentType.API, "Product & Package Shipping Catalog", "Catalog Team", 7.0));
        nodes.put("Pricing Service", createNode(dataset, "Pricing Service", ComponentType.API, "Dynamic Shipping Rates & Tariff Engine", "Billing Team", 8.5));
        nodes.put("Inventory Service", createNode(dataset, "Inventory Service", ComponentType.API, "Warehouse Stock & Parcel Vault Management", "Supply Chain Team", 8.5));
        nodes.put("Cart Service", createNode(dataset, "Cart Service", ComponentType.API, "Shopping Cart & Pre-checkout Session", "E-Commerce Team", 7.5));
        nodes.put("Order Service", createNode(dataset, "Order Service", ComponentType.API, "Parcel Booking & Order Management System", "Logistics Core Team", 9.5));
        nodes.put("Invoice Service", createNode(dataset, "Invoice Service", ComponentType.API, "Billing & Tax Invoice Generation", "Finance Team", 7.0));
        nodes.put("UPS Tracking API", createNode(dataset, "UPS Tracking API", ComponentType.API, "Real-time Package Tracking & Event Stream", "Tracking Team", 9.0));
        nodes.put("Address Validation API", createNode(dataset, "Address Validation API", ComponentType.API, "Global Geocoding & Address Standardization", "Address Team", 7.5));
        nodes.put("Fleet Dispatch Service", createNode(dataset, "Fleet Dispatch Service", ComponentType.API, "Driver Dispatch & Delivery Scheduling", "Fleet Ops Team", 8.8));
        nodes.put("Notification Service", createNode(dataset, "Notification Service", ComponentType.API, "SMS, Email & Push Alerts Dispatcher", "Comms Team", 6.5));
        nodes.put("Customs Declaration Service", createNode(dataset, "Customs Declaration Service", ComponentType.API, "Cross-border Customs Documentation", "International Ops", 8.0));

        // Applications
        nodes.put("Customer Portal", createNode(dataset, "Customer Portal", ComponentType.APPLICATION, "Web portal for package tracking & shipping label creation", "Frontend Team", 8.0));
        nodes.put("Admin Console", createNode(dataset, "Admin Console", ComponentType.APPLICATION, "Internal UPS Operations & Configuration Portal", "Internal Tools Team", 8.5));
        nodes.put("Operations Dashboard", createNode(dataset, "Operations Dashboard", ComponentType.APPLICATION, "Hub Logistics & Dispatch Control Tower", "Logistics Ops Team", 9.0));
        nodes.put("UPS Mobile App", createNode(dataset, "UPS Mobile App", ComponentType.APPLICATION, "Mobile app for drivers & customers", "Mobile Team", 8.5));

        // Databases
        nodes.put("Customer DB", createNode(dataset, "Customer DB", ComponentType.DATABASE, "PostgreSQL database for Customer profiles", "Data Infra Team", 9.0));
        nodes.put("Product DB", createNode(dataset, "Product DB", ComponentType.DATABASE, "PostgreSQL database for Products & Shipping Rates", "Data Infra Team", 8.0));
        nodes.put("Order DB", createNode(dataset, "Order DB", ComponentType.DATABASE, "High-throughput DB for Orders & Parcels", "Data Infra Team", 9.8));
        nodes.put("Fleet DB", createNode(dataset, "Fleet DB", ComponentType.DATABASE, "Database for Vehicles, Drivers & Hub Lockers", "Data Infra Team", 8.5));

        // External Systems
        nodes.put("Payment Gateway", createNode(dataset, "Payment Gateway", ComponentType.EXTERNAL_SYSTEM, "External Payment Provider (Stripe/Bank Gateway)", "External Provider", 9.0));
        nodes.put("UPS Core Mainframe", createNode(dataset, "UPS Core Mainframe", ComponentType.EXTERNAL_SYSTEM, "Legacy Enterprise Core Parcel Ledger", "Enterprise IT", 9.5));
        nodes.put("Mapping Provider", createNode(dataset, "Mapping Provider", ComponentType.EXTERNAL_SYSTEM, "External Mapping & Route Matrix API", "External Provider", 8.0));

        // Define Dependencies (source = dependency/provider, target = consumer)
        // 1. Auth Service Consumers
        createEdge(dataset, nodes.get("Auth Service"), nodes.get("Customer Service"));
        createEdge(dataset, nodes.get("Auth Service"), nodes.get("Payment Service"));
        createEdge(dataset, nodes.get("Auth Service"), nodes.get("Inventory Service"));
        createEdge(dataset, nodes.get("Auth Service"), nodes.get("Admin Console"));
        createEdge(dataset, nodes.get("Auth Service"), nodes.get("Customer Portal"));
        createEdge(dataset, nodes.get("Auth Service"), nodes.get("Operations Dashboard"));
        createEdge(dataset, nodes.get("Auth Service"), nodes.get("UPS Mobile App"));

        // 2. Customer DB & Customer Service Dependencies
        createEdge(dataset, nodes.get("Customer DB"), nodes.get("Customer Service"));
        createEdge(dataset, nodes.get("Customer DB"), nodes.get("Inventory Service"));
        createEdge(dataset, nodes.get("Customer Service"), nodes.get("Cart Service"));
        createEdge(dataset, nodes.get("Customer Service"), nodes.get("Order Service"));
        createEdge(dataset, nodes.get("Customer Service"), nodes.get("Customer Portal"));

        // 3. Product Catalog & Pricing Service Dependencies
        createEdge(dataset, nodes.get("Product DB"), nodes.get("Product Catalog Service"));
        createEdge(dataset, nodes.get("Product Catalog Service"), nodes.get("Pricing Service"));
        createEdge(dataset, nodes.get("Product Catalog Service"), nodes.get("Inventory Service"));
        createEdge(dataset, nodes.get("Product Catalog Service"), nodes.get("Customer Portal"));
        createEdge(dataset, nodes.get("Pricing Service"), nodes.get("Cart Service"));
        createEdge(dataset, nodes.get("Pricing Service"), nodes.get("Order Service"));

        // 4. Inventory Service Dependencies
        createEdge(dataset, nodes.get("Inventory Service"), nodes.get("Cart Service"));
        createEdge(dataset, nodes.get("Inventory Service"), nodes.get("Order Service"));

        // 5. Payment Service Dependencies
        createEdge(dataset, nodes.get("Payment Gateway"), nodes.get("Payment Service"));
        createEdge(dataset, nodes.get("Payment Service"), nodes.get("Order Service"));

        // 6. Order Service & Order DB Dependencies
        createEdge(dataset, nodes.get("Order DB"), nodes.get("Order Service"));
        createEdge(dataset, nodes.get("Order Service"), nodes.get("Invoice Service"));
        createEdge(dataset, nodes.get("Order Service"), nodes.get("UPS Tracking API"));
        createEdge(dataset, nodes.get("Order Service"), nodes.get("Fleet Dispatch Service"));
        createEdge(dataset, nodes.get("Order Service"), nodes.get("Customs Declaration Service"));
        createEdge(dataset, nodes.get("Order Service"), nodes.get("Customer Portal"));
        createEdge(dataset, nodes.get("Order Service"), nodes.get("Admin Console"));

        // 7. Fleet & Tracking Dependencies
        createEdge(dataset, nodes.get("Fleet DB"), nodes.get("Fleet Dispatch Service"));
        createEdge(dataset, nodes.get("Mapping Provider"), nodes.get("Fleet Dispatch Service"));
        createEdge(dataset, nodes.get("Address Validation API"), nodes.get("Order Service"));
        createEdge(dataset, nodes.get("Address Validation API"), nodes.get("Fleet Dispatch Service"));
        createEdge(dataset, nodes.get("Fleet Dispatch Service"), nodes.get("Operations Dashboard"));
        createEdge(dataset, nodes.get("Fleet Dispatch Service"), nodes.get("UPS Mobile App"));
        createEdge(dataset, nodes.get("UPS Tracking API"), nodes.get("Notification Service"));
        createEdge(dataset, nodes.get("UPS Tracking API"), nodes.get("UPS Mobile App"));
        createEdge(dataset, nodes.get("UPS Tracking API"), nodes.get("Customer Portal"));
        createEdge(dataset, nodes.get("Invoice Service"), nodes.get("Customer Portal"));
        createEdge(dataset, nodes.get("UPS Core Mainframe"), nodes.get("Order Service"));

        log.info("UPS Enterprise Logistics Ecosystem successfully pre-seeded with 24 components and 36 dependencies!");
    }

    private ComponentNode createNode(Dataset dataset, String name, ComponentType type, String desc, String owner, double criticality) {
        return componentRepository.save(ComponentNode.builder()
                .dataset(dataset)
                .name(name)
                .type(type)
                .description(desc)
                .teamOwner(owner)
                .criticalityScore(criticality)
                .build());
    }

    private void createEdge(Dataset dataset, ComponentNode source, ComponentNode target) {
        dependencyRepository.save(ComponentDependency.builder()
                .dataset(dataset)
                .sourceComponent(source)
                .targetComponent(target)
                .dependencyType("STRICT")
                .build());
    }
}
