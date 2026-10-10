package com.vulntrack.dto;

import java.time.LocalDateTime;

public class RemediationDTO {

    private Long id;
    private Long vulnerabilityId;

    private Long developerId;
    private String developerName;

    private String rootCause;
    private String solutionImplemented;
    private String technicalChanges;
    private String testingPerformed;
    private String additionalNotes;

    private String reviewReason;
    
    private String analystFeedback;

    private String status;

    private LocalDateTime fixedAt;
    private LocalDateTime verifiedAt;

    public RemediationDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVulnerabilityId() {
        return vulnerabilityId;
    }

    public void setVulnerabilityId(Long vulnerabilityId) {
        this.vulnerabilityId = vulnerabilityId;
    }

    public Long getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(Long developerId) {
        this.developerId = developerId;
    }

    public String getDeveloperName() {
        return developerName;
    }

    public void setDeveloperName(String developerName) {
        this.developerName = developerName;
    }

    public String getRootCause() {
        return rootCause;
    }

    public void setRootCause(String rootCause) {
        this.rootCause = rootCause;
    }

    public String getSolutionImplemented() {
        return solutionImplemented;
    }

    public void setSolutionImplemented(String solutionImplemented) {
        this.solutionImplemented = solutionImplemented;
    }

    public String getTechnicalChanges() {
        return technicalChanges;
    }

    public void setTechnicalChanges(String technicalChanges) {
        this.technicalChanges = technicalChanges;
    }

    public String getTestingPerformed() {
        return testingPerformed;
    }

    public void setTestingPerformed(String testingPerformed) {
        this.testingPerformed = testingPerformed;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public String getReviewReason() { return reviewReason; }
    public void setReviewReason(String reviewReason) { this.reviewReason = reviewReason; }
    public String getAnalystFeedback() { return analystFeedback; }
    public void setAnalystFeedback(String analystFeedback) { this.analystFeedback = analystFeedback; }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getFixedAt() {
        return fixedAt;
    }

    public void setFixedAt(LocalDateTime fixedAt) {
        this.fixedAt = fixedAt;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}