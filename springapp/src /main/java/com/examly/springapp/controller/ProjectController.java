package com.examly.springapp.controller;

import com.examly.springapp.model.Project;
import com.examly.springapp.dto.ProjectDTO;
import com.examly.springapp.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // ➤ Add Project - Only ADMIN
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<String> addProject(@RequestBody ProjectDTO projectDTO) {
        Project savedProject = projectService.addProject(projectDTO);
        if (savedProject != null) {
            return ResponseEntity.ok("✅ Project created with ID: " + savedProject.getProjectId());
        }
        return ResponseEntity.badRequest().body("❌ Manager not found with ID: " + projectDTO.getManagerId());
    }

    // ➤ Get All Projects - ADMIN & STAKEHOLDER
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STAKEHOLDER')")
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // ➤ Get Project by ID - ADMIN & STAKEHOLDER
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STAKEHOLDER')")
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable Long projectId) {
        return projectService.getProjectById(projectId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("❌ Project not found with ID: " + projectId));
    }

    // ➤ Update Project - Only ADMIN
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<String> updateProject(@RequestBody ProjectDTO projectDTO) {
        String result = projectService.updateProject(projectDTO.getProjectId(), projectDTO);
        return ResponseEntity.ok(result);
    }

    // ➤ Delete Project - Only ADMIN
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.deleteProject(projectId));
    }

    // ➤ Get Projects by Manager - Only ADMIN
    // (stakeholder can see projects but not filtered by manager)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<?> getProjectsByManagerId(@PathVariable Long managerId) {
        List<Project> projects = projectService.getProjectsByManagerId(managerId);
        if (projects.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("❌ No projects found or manager not found with ID: " + managerId);
        }
        return ResponseEntity.ok(projects);
    }
}
