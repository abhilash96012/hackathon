# UPS DependencyLens - API Dependency Visualizer & Change Impact Analyzer

**Use Case ID**: `2026 GH-CTI-01`  
**SPOC**: Sujatha Rajasekaran / Lakshmi Surianarayanan  
**Hackathon**: UPS On-Campus Hackathon  

---

## Executive Summary & Problem Overview

Modern enterprise applications consist of multiple interconnected APIs, microservices, databases, applications, and external third-party systems. When a component fails or undergoes code modification, engineering teams often struggle to quickly understand which downstream systems are impacted and how failure propagates across the ecosystem.

**UPS DependencyLens** is an enterprise-grade web application that ingests YAML dependency datasets, visualizes component relationships using an interactive graph canvas, simulates component outages (Blast Radius analysis), performs change impact analysis, automatically generates regression test suites, and provides AI-powered architectural resilience insights.

---

## Key Features

1. **YAML Dataset Ingestion**: Ingest single or multi-document YAML dependency definitions containing services, applications, databases, and external systems.
2. **Interactive Dependency Graph Visualizer**: Render custom directed acyclic dependency graphs (DAG) using Cytoscape.js with zoom, pan, node search, filter by component type, and node detail cards.
3. **Service Outage Simulator & Blast Radius Calculator**: Simulate component outages (e.g. `Auth Service`), traverse downstream dependency paths via BFS/DFS algorithms, calculate ecosystem blast radius %, and isolate disrupted user applications.
4. **Change Impact & Automated Test Scope Recommender**: Select any modified component (e.g. `Inventory Service`), inspect direct vs. indirect consumer impact, evaluate deployment risk rating (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and generate a tailored automated regression test scope checklist.
5. **Ecosystem Analytics & Centrality Metrics**: Real-time KPI summary bar computing Total Components, APIs, Databases, Applications, External Integrations, Most Connected Service (Degree Centrality), Critical Service Candidate, and Max Blast Radius Candidate.
6. **AI Resilience & Vulnerability Inspector**: Automated AI audit evaluating component resilience scores (0–100), single points of failure (SPOFs), architectural anti-patterns (e.g., Shared DB anti-pattern), and recommended mitigation strategies.

---

## Technology Stack

- **Frontend**: Angular 18, TypeScript, Tailwind CSS, Cytoscape.js, FontAwesome Icons
- **Backend**: Java 21, Spring Boot 3.3.3, Spring Data JPA, SnakeYAML, Lombok, Springdoc OpenAPI (Swagger)
- **Database**: PostgreSQL 16 (with H2 embedded dev fallback)
- **DevOps**: Docker, Docker Compose, Nginx

---

## Architecture Overview

```
+-----------------------------------------------------------------------+
|                         Angular 18 Frontend                           |
|  - Interactive Graph (Cytoscape.js)                                   |
|  - Outage Simulator & Blast Radius Visualizer                         |
|  - Change Impact & Test Scope Recommender                             |
|  - Ecosystem Metrics Dashboard                                        |
|  - YAML Dataset Ingestion Interface                                   |
+-----------------------------------------------------------------------+
                                   | REST API (Swagger / OpenAPI)
                                   v
+-----------------------------------------------------------------------+
|                    Spring Boot 3 (Java 21) Backend                    |
|  - Controller: GraphController, OutageController, ImpactController,   |
|                DatasetController, AIResilienceController              |
|  - Service: GraphTraversalService (BFS/DFS Traversal),                |
|             YamlIngestionService, EcosystemMetricsService,            |
|             AIResilienceAdvisorService                                |
|  - Repository: ComponentRepository, DependencyRepository,             |
|              DatasetRepository                                        |
+-----------------------------------------------------------------------+
                                   | JPA / Hibernate
                                   v
+-----------------------------------------------------------------------+
|                          PostgreSQL Database                          |
|  - Tables: datasets, components, component_dependencies               |
+-----------------------------------------------------------------------+
```

---

## Database Schema

- `datasets`: `id`, `name`, `description`, `is_default`, `created_at`
- `components`: `id`, `dataset_id`, `name`, `type` (`API`, `APPLICATION`, `DATABASE`, `EXTERNAL_SYSTEM`), `description`, `team_owner`, `criticality_score`, `created_at`
- `component_dependencies`: `id`, `dataset_id`, `source_component_id` (dependency/provider), `target_component_id` (consumer), `dependency_type`, `created_at`

---

## Quick Start & Setup Instructions

### 1. Run with Docker Compose (Recommended)

```bash
docker compose up --build
```

- **Frontend Web UI**: `http://localhost`
- **Backend REST API**: `http://localhost:8080/api`
- **Swagger API Documentation**: `http://localhost:8080/api/swagger-ui.html`

---

## Demo Sequence for Hackathon Jury

1. **Ecosystem Overview**: Open `http://localhost` to view the pre-seeded **UPS Enterprise Logistics Ecosystem** containing 24 components (Auth, Customer, Order, Fleet Dispatch, UPS Tracking API, Address Validation, DBs, Mobile App, etc.).
2. **Interactive Graph Navigation**: Use search bar or filter by component type (`API`, `Application`, `Database`, `External`). Click any node (e.g., `Order Service`) to view incoming consumer count and outgoing dependencies.
3. **Outage Simulation (Scenario 1)**: Click **Outage Simulator** -> Select `Auth Service` -> Click **Run Outage Blast Radius Test**. Observe red cascade propagation across `Customer Service`, `Payment Service`, `Order Service`, `Invoice Service`, and the 4 disabled user applications (`Customer Portal`, `Admin Console`, `Operations Dashboard`, `UPS Mobile App`).
4. **Change Impact Analysis (Scenario 2)**: Click **Change Impact** -> Select `Inventory Service` -> Click **Analyze Change Impact**. Observe direct impact (`Cart Service`, `Order Service`), indirect impact (`Invoice Service`), and auto-generated regression test scope.
5. **AI Resilience Audit**: Click **AI Audit** -> Select `Auth Service` or `Order DB` to generate a 0-100 resilience score, single point of failure (SPOF) alert, and circuit breaker mitigation recommendations.
6. **YAML Ingestion**: Click **Ingest YAML** -> Click **Load Sample YAML Template** -> Click **Ingest & Build Graph** to parse a custom 4-service YAML dataset in real-time.

---

## Technical Interview Questions & Answers

1. **Q: How does your graph traversal handle cyclic dependencies?**  
   *A: We use BFS and DFS traversals equipped with a `visited` node set (`Set<Long>`) to track visited nodes during cascade propagation, preventing infinite loops.*

2. **Q: What is the difference between source and target in your edge model?**  
   *A: `sourceComponent` represents the dependency/provider service being consumed (e.g. Auth Service), while `targetComponent` represents the consumer service calling it (e.g. Customer Portal).*

3. **Q: How do you calculate degree centrality and blast radius?**  
   *A: Degree centrality is the sum of incoming edges (consumers) and outgoing edges (dependencies). Blast radius is the total count of reachable consumer nodes divided by total ecosystem components.*

4. **Q: How does the YAML ingestion handle missing nodes or implicit references?**  
   *A: `YamlIngestionService` runs a two-pass algorithm. Pass 1 creates declared nodes; Pass 2 infers and auto-creates implicit missing dependency nodes based on name heuristics.*

5. **Q: Why Spring Boot 3 and Java 21?**  
   *A: Java 21 provides Virtual Threads (Project Loom) for high concurrency during heavy traversal operations, and Spring Boot 3 provides native OpenAPI 3 support.*

6. **Q: How is CORS configured?**  
   *A: Global CORS is configured in `WebConfig.java` pulling allowed origins dynamically from `application.yml` / `CORS_ALLOWED_ORIGINS` environment variables.*

7. **Q: How do you handle database persistence?**  
   *A: Spring Data JPA with Hibernate. Relationships map `Dataset`, `ComponentNode`, and `ComponentDependency` with foreign keys and unique constraints.*

8. **Q: What graph visualization library is used?**  
   *A: Cytoscape.js with `cose` physics layout, custom color-coded styles by node type, and interactive tap listeners.*

9. **Q: Is the AI feature mandatory? What if no API key is set?**  
   *A: The AI Resilience Advisor uses a deterministic heuristic fallback engine when no OpenAI or Gemini key is provided, guaranteeing 100% functionality.*

10. **Q: How are non-functional requirements like response time guaranteed?**  
    *A: Graph traversals run in memory in `O(V + E)` time complexity over indexed database lookups, executing in under 15ms.*

11. **Q: How do you identify Single Points of Failure (SPOFs)?**  
    *A: A node is flagged as a SPOF if it has 3+ direct consumers AND its failure disables 2+ user-facing application touchpoints.*

12. **Q: How does the test scope recommender work?**  
    *A: It inspects the target component type and traverses direct/indirect consumers to synthesize tailored unit, integration, contract, and e2e user journey test suites.*

13. **Q: What is the Docker container strategy?**  
    *A: Multi-stage Dockerfiles for both backend (Maven build -> Temurin JRE alpine runtime) and frontend (Node build -> Nginx alpine reverse proxy).*

14. **Q: Can multiple YAML files be combined into a single dataset?**  
    *A: Yes, SnakeYAML `loadAll()` parses multi-document streams (`---`) or arrays of YAML strings in a single ingestion transaction.*

15. **Q: How does your solution support production deployment?**  
    *A: All configurations (db url, ports, secrets, cors) are driven by environment variables, making it deployment-ready for AWS, Azure, GCP, Render, or Railway.*

---

## License & Copyright

Developed for the UPS On-Campus Hackathon 2026. All rights reserved.
