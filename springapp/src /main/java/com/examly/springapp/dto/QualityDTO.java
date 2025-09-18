package com.examly.springapp.dto;

import java.time.LocalDate;

public class QualityDTO {
    private Long metricId;
    private Long projectId;
    private int bugCount;
    private int resolvedCount;
    private double qualityScore;
    private LocalDate calculatedDate;

    public QualityDTO() {}

    public QualityDTO(Long metricId, Long projectId, int bugCount, int resolvedCount, double qualityScore, LocalDate calculatedDate) {
        this.metricId = metricId;
        this.projectId = projectId;
        this.bugCount = bugCount;
        this.resolvedCount = resolvedCount;
        this.qualityScore = qualityScore;
        this.calculatedDate = calculatedDate;
    }

    public Long getMetricId() { return metricId; }
    public void setMetricId(Long metricId) { this.metricId = metricId; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public int getBugCount() { return bugCount; }
    public void setBugCount(int bugCount) { this.bugCount = bugCount; }

    public int getResolvedCount() { return resolvedCount; }
    public void setResolvedCount(int resolvedCount) { this.resolvedCount = resolvedCount; }

    public double getQualityScore() { return qualityScore; }
    public void setQualityScore(double qualityScore) { this.qualityScore = qualityScore; }

    public LocalDate getCalculatedDate() { return calculatedDate; }
    public void setCalculatedDate(LocalDate calculatedDate) { this.calculatedDate = calculatedDate; }
}
