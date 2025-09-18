package com.examly.springapp.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @Column(nullable = false)
    private String projectName;

    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    public Project() {}

    public Project(String projectName, LocalDate startDate, LocalDate endDate, User manager) {
        this.projectName = projectName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.manager = manager;
    }

    // Getters & Setters
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public User getManager() { return manager; }
    public void setManager(User manager) { this.manager = manager; }
}
