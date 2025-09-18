package com.examly.springapp.model;

import java.time.LocalDate;
import javax.persistence.*;



@Entity
@Table(name = "quality")
public class Quality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long metricId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private int bugCount;
    private int resolvedCount;
    private double qualityScore;
    private LocalDate calculatedDate;

    public Quality() {}

    public Quality(Project project, int bugCount, int resolvedCount, double qualityScore, LocalDate calculatedDate) {
        this.project = project;
        this.bugCount = bugCount;
        this.resolvedCount = resolvedCount;
        this.qualityScore = qualityScore;
        this.calculatedDate = calculatedDate;
    }

    public Long getMetricId() { return metricId; }
    public void setMetricId(Long metricId) { this.metricId = metricId; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public int getBugCount() { return bugCount; }
    public void setBugCount(int bugCount) { this.bugCount = bugCount; }

    public int getResolvedCount() { return resolvedCount; }
    public void setResolvedCount(int resolvedCount) { this.resolvedCount = resolvedCount; }

    public double getQualityScore() { return qualityScore; }
    public void setQualityScore(double qualityScore) { this.qualityScore = qualityScore; }

    public LocalDate getCalculatedDate() { return calculatedDate; }
    public void setCalculatedDate(LocalDate calculatedDate) { this.calculatedDate = calculatedDate; }
}
