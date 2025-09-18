package com.examly.springapp.dto;

import java.time.LocalDate;

public class BugDTO {
    private Long bugId;
    private String title;
    private String description;
    private String priority;   // store as String instead of Enum (easy for JSON)
    private Long projectId;    // instead of full Project object
    private LocalDate createdDate;

    public BugDTO() {}

    public BugDTO(Long bugId, String title, String description, String priority, Long projectId, LocalDate createdDate) {
        this.bugId = bugId;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.projectId = projectId;
        this.createdDate = createdDate;
    }

    // getters and setters
    public Long getBugId() { return bugId; }
    public void setBugId(Long bugId) { this.bugId = bugId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
}
