package com.vulntrack.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "remediations")
public class Remediation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "vulnerability_id",
            nullable = false,
            unique = true
    )
    private Vulnerability vulnerability;

    @ManyToOne
    @JoinColumn(
            name = "developer_id",
            nullable = false
    )
    private User developer;

    @Column(columnDefinition = "TEXT")
    private String rootCause;

    @Column(columnDefinition = "TEXT")
    private String solutionImplemented;

    @Column(columnDefinition = "TEXT")
    private String technicalChanges;

    @Column(columnDefinition = "TEXT")
    private String testingPerformed;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    private String reviewReason;
    @Column(columnDefinition = "TEXT")
    private String analystFeedback;

    private String status;

    private LocalDateTime fixedAt;

    private LocalDateTime verifiedAt;

    public Remediation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vulnerability getVulnerability() {
        return vulnerability;
    }

    public void setVulnerability(Vulnerability vulnerability) {
        this.vulnerability = vulnerability;
    }

    public User getDeveloper() {
        return developer;
    }

    public void setDeveloper(User developer) {
        this.developer = developer;
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