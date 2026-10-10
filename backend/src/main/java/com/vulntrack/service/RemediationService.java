
package com.vulntrack.service;

import java.time.LocalDateTime;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vulntrack.dto.RemediationDTO;
import com.vulntrack.entity.Remediation;
import com.vulntrack.entity.User;
import com.vulntrack.entity.Vulnerability;
import com.vulntrack.entity.VulnerabilityStatus;
import com.vulntrack.exception.ResourceNotFoundException;
import com.vulntrack.repository.RemediationRepository;
import com.vulntrack.repository.UserRepository;
import com.vulntrack.repository.VulnerabilityRepository;

@Service
public class RemediationService {

    private final RemediationRepository remediationRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final UserRepository userRepository;

    public RemediationService(
            RemediationRepository remediationRepository,
            VulnerabilityRepository vulnerabilityRepository,
            UserRepository userRepository) {

        this.remediationRepository = remediationRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // 1. CHECK DEVELOPER OWNERSHIP
    // ==========================================

    private Vulnerability checkOwnership(
            Long vulnerabilityId,
            String developerEmail) {

        User developer = userRepository
                .findByEmail(developerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Developer not found"
                        )
                );

        Vulnerability vulnerability = vulnerabilityRepository
                .findById(vulnerabilityId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vulnerability not found"
                        )
                );

        if (vulnerability.getAssignedTo() == null ||
                !vulnerability.getAssignedTo()
                        .getId().equals(developer.getId())) {

            throw new AccessDeniedException(
                    "You are not assigned to this vulnerability."
            );
        }

        return vulnerability;
    }

    // ==========================================
    // 2. VALIDATE REQUIRED FIELDS
    // ==========================================

    private void requireText(
            String value,
            String fieldName) {

        if (value == null || value.isBlank()) {

            throw new IllegalArgumentException(
                    fieldName + " is required."
            );
        }
    }

    // ==========================================
    // 3. SUBMIT OR RESUBMIT REMEDIATION
    // ==========================================

    @Transactional
    public RemediationDTO updateRemediation(
            Long vulnerabilityId,
            RemediationDTO request,
            String developerEmail) {

        Vulnerability vulnerability =
                checkOwnership(vulnerabilityId, developerEmail);

        if (request == null) {

            throw new IllegalArgumentException(
                    "Remediation details are required."
            );
        }

        // Only these statuses allow developer editing
        if (vulnerability.getStatus() != VulnerabilityStatus.ASSIGNED
                && vulnerability.getStatus() != VulnerabilityStatus.IN_PROGRESS
                && vulnerability.getStatus() != VulnerabilityStatus.REOPENED) {

            throw new IllegalStateException(
                    "Only assigned, in-progress or reopened vulnerabilities can be submitted."
            );
        }

        // Validate mandatory fields
        requireText(
                request.getRootCause(),
                "Root cause"
        );

        requireText(
                request.getSolutionImplemented(),
                "Solution implemented"
        );

        requireText(
                request.getTechnicalChanges(),
                "Technical changes"
        );

        requireText(
                request.getTestingPerformed(),
                "Testing performed"
        );

        User developer = vulnerability.getAssignedTo();

        // Reuse existing remediation when resubmitting
        Remediation remediation = remediationRepository
                .findByVulnerabilityId(vulnerabilityId)
                .orElseGet(Remediation::new);

        remediation.setVulnerability(vulnerability);
        remediation.setDeveloper(developer);

        remediation.setRootCause(
                request.getRootCause().trim()
        );

        remediation.setSolutionImplemented(
                request.getSolutionImplemented().trim()
        );

        remediation.setTechnicalChanges(
                request.getTechnicalChanges().trim()
        );

        remediation.setTestingPerformed(
                request.getTestingPerformed().trim()
        );

        remediation.setAdditionalNotes(
                request.getAdditionalNotes() == null
                        ? null
                        : request.getAdditionalNotes().trim()
        );

        remediation.setStatus("REMEDIATED");
        remediation.setFixedAt(LocalDateTime.now());

        // Reset previous verification timestamp
        remediation.setVerifiedAt(null);

        Remediation saved =
                remediationRepository.save(remediation);

        // Send the vulnerability back for Analyst review
        vulnerability.setStatus(
                VulnerabilityStatus.REMEDIATED
        );

        vulnerabilityRepository.save(vulnerability);

        return convert(saved);
    }

    // ==========================================
    // 4. GET REMEDIATION - DEVELOPER
    // Ownership checked
    // ==========================================

    @Transactional(readOnly = true)
    public RemediationDTO getRemediation(
            Long vulnerabilityId,
            String developerEmail) {

        checkOwnership(
                vulnerabilityId,
                developerEmail
        );

        Remediation remediation = remediationRepository
                .findByVulnerabilityId(vulnerabilityId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Remediation not found"
                        )
                );

        return convert(remediation);
    }

    // ==========================================
    // 5. GET REMEDIATION - ANALYST / ADMIN
    // ==========================================

    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    @Transactional(readOnly = true)
    public RemediationDTO getRemediation(
            Long vulnerabilityId) {

        Remediation remediation = remediationRepository
                .findByVulnerabilityId(vulnerabilityId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Remediation not found"
                        )
                );

        return convert(remediation);
    }

    // ==========================================
    // 6. CONVERT ENTITY TO DTO
    // ==========================================

    private RemediationDTO convert(
            Remediation remediation) {

        RemediationDTO dto = new RemediationDTO();

        dto.setId(
                remediation.getId()
        );

        dto.setVulnerabilityId(
                remediation.getVulnerability().getId()
        );

        dto.setDeveloperId(
                remediation.getDeveloper().getId()
        );

        dto.setDeveloperName(
                remediation.getDeveloper().getName()
        );

        dto.setRootCause(
                remediation.getRootCause()
        );

        dto.setSolutionImplemented(
                remediation.getSolutionImplemented()
        );

        dto.setTechnicalChanges(
                remediation.getTechnicalChanges()
        );

        dto.setTestingPerformed(
                remediation.getTestingPerformed()
        );

        dto.setAdditionalNotes(
                remediation.getAdditionalNotes()
        );

        dto.setReviewReason(
                remediation.getReviewReason()
        );

        dto.setAnalystFeedback(
                remediation.getAnalystFeedback()
        );

        dto.setStatus(
                remediation.getStatus()
        );

        dto.setFixedAt(
                remediation.getFixedAt()
        );

        dto.setVerifiedAt(
                remediation.getVerifiedAt()
        );

        return dto;
    }
}
