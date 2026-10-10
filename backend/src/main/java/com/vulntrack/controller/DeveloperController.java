
package com.vulntrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;

import com.vulntrack.dto.RemediationDTO;
import com.vulntrack.dto.VulnerabilityResponseDTO;
import com.vulntrack.service.RemediationService;
import com.vulntrack.service.VulnerabilityService;

@RestController
@RequestMapping("/api/developer")
@Validated
public class DeveloperController {

    private final VulnerabilityService vulnerabilityService;
    private final RemediationService remediationService;

    public DeveloperController(
            VulnerabilityService vulnerabilityService,
            RemediationService remediationService) {

        this.vulnerabilityService = vulnerabilityService;
        this.remediationService = remediationService;
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<VulnerabilityResponseDTO>>
    getAssigned(Authentication authentication) {

        return ResponseEntity.ok(
                vulnerabilityService.getDeveloperVulnerabilities(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/remediation/{vulnerabilityId}")
    public ResponseEntity<RemediationDTO> getRemediation(
            @PathVariable Long vulnerabilityId,
            Authentication authentication) {

        return ResponseEntity.ok(
                remediationService.getRemediation(
                        vulnerabilityId,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/remediation/{vulnerabilityId}")
    public ResponseEntity<RemediationDTO> updateRemediation(
            @PathVariable Long vulnerabilityId,
            @Valid @RequestBody RemediationDTO request,
            Authentication authentication) {

        return ResponseEntity.ok(
                remediationService.updateRemediation(
                        vulnerabilityId,
                        request,
                        authentication.getName()
                )
        );
    }
}
