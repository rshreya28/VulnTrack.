package com.vulntrack.controller;

import com.vulntrack.dto.VulnerabilityRequestDTO;
import com.vulntrack.dto.ReviewRequestDTO;
import com.vulntrack.dto.RemediationDTO;
import com.vulntrack.service.RemediationService;
import com.vulntrack.dto.VulnerabilityResponseDTO;

import com.vulntrack.service.VulnerabilityService;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analyst")
@PreAuthorize(
        "hasAnyRole('ADMIN','ANALYST')"
)
public class AnalystController {

    private final VulnerabilityService
            vulnerabilityService;
    private final RemediationService remediationService;

    public AnalystController(
            VulnerabilityService vulnerabilityService, RemediationService remediationService) {

        this.vulnerabilityService =
                vulnerabilityService;
        this.remediationService = remediationService;
    }

    @PostMapping("/vulnerabilities")
    public VulnerabilityResponseDTO report(
            @Valid
            @RequestBody
            VulnerabilityRequestDTO request,
            Authentication authentication) {

        return vulnerabilityService.create(
                request,
                authentication.getName()
        );
    }

    @GetMapping("/my-reports")
    public List<VulnerabilityResponseDTO>
    myReports(
            Authentication authentication) {

        return vulnerabilityService
                .getAnalystVulnerabilities(
                        authentication.getName()
                );
    }

    @GetMapping("/pending-verification")
    public List<VulnerabilityResponseDTO>
    pendingVerification() {

        return vulnerabilityService
                .getPendingVerification();
    }

    @GetMapping("/remediation/{id}")
    public RemediationDTO remediation(@PathVariable Long id) {
        return remediationService.getRemediation(id);
    }

    @PutMapping("/verify/{id}")
    public VulnerabilityResponseDTO verify(
            @PathVariable Long id, @RequestBody ReviewRequestDTO request) {

        return vulnerabilityService
                .verify(id, request);
    }

    @PutMapping("/reopen/{id}")
    public VulnerabilityResponseDTO reopen(
            @PathVariable Long id, @RequestBody ReviewRequestDTO request) {

        return vulnerabilityService
                .reopen(id, request);
    }
}