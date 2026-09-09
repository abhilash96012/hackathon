package com.ups.dependencylens.repository;

import com.ups.dependencylens.model.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {
    Optional<Dataset> findByIsDefaultTrue();
    Optional<Dataset> findByName(String name);
}
