package com.examly.springapp.dto;

import com.examly.springapp.model.Priority;

public class BugCreateDTO {
    private String title;
    private String description;
    private Priority priority;
    private Long projectId;

    public BugCreateDTO() {}

    public BugCreateDTO(String title, String description, Priority priority, Long projectId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.projectId = projectId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
}
