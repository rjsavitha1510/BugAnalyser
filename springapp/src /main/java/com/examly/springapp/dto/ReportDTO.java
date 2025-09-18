package com.examly.springapp.dto;

import java.time.LocalDateTime;

public class ReportDTO {
    private Long reportId;
    private String type;
    private String parameters;
    private LocalDateTime generatedDate;
    private String generatedBy;
    private String reportUrl;
    private String format;

    public ReportDTO() {}

    public ReportDTO(Long reportId, String type, String parameters, LocalDateTime generatedDate, 
                       String generatedBy, String reportUrl, String format) {
        this.reportId = reportId;
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
