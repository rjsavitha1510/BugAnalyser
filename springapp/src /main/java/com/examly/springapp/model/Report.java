package com.examly.springapp.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "analyticreport")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private String type; 

    @Column(columnDefinition = "TEXT")
    private String parameters; 

    private LocalDateTime generatedDate;

    private String generatedBy;

    private String reportUrl; 

    private String format; 

    public Report() {}

    public Report(String type, String parameters, LocalDateTime generatedDate,
                     String generatedBy, String reportUrl, String format) {
        this.type = type;
        this.parameters = parameters;
        this.generatedDate = generatedDate;
        this.generatedBy = generatedBy;
        this.reportUrl = reportUrl;
        this.format = format;
    }

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getParameters() { return parameters; }
    public void setParameters(String parameters) { this.parameters = parameters; }

    public LocalDateTime getGeneratedDate() { return generatedDate; }
    public void setGeneratedDate(LocalDateTime generatedDate) { this.generatedDate = generatedDate; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public String getReportUrl() { return reportUrl; }
    public void setReportUrl(String reportUrl) { this.reportUrl = reportUrl; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
}
