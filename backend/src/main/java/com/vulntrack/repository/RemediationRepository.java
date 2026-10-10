package com.vulntrack.repository;

import com.vulntrack.entity.Remediation;
import com.vulntrack.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RemediationRepository
        extends JpaRepository<Remediation, Long> {

    Optional<Remediation>
    findByVulnerabilityId(Long vulnerabilityId);

    boolean existsByDeveloper(User developer);
}