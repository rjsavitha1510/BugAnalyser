package com.examly.springapp.service;

import com.examly.springapp.model.Project;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.dto.ProjectDTO;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    public Project addProject(ProjectDTO projectDTO) {
        return userRepository.findById(projectDTO.getManagerId())
                .map(manager -> {
                    Project project = new Project();
                    project.setProjectName(projectDTO.getProjectName());
                    project.setStartDate(projectDTO.getStartDate());
                    project.setEndDate(projectDTO.getEndDate());
                    project.setManager(manager);
                    return projectRepository.save(project);
                })
                .orElse(null);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public String updateProject(Long id, ProjectDTO projectDTO) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        Optional<User> managerOpt = userRepository.findById(projectDTO.getManagerId());

        if (projectOpt.isEmpty()) {
            return " Project not found with ID: " + id;
        }
        if (managerOpt.isEmpty()) {
            return " Manager not found with ID: " + projectDTO.getManagerId();
        }

        Project existingProject = projectOpt.get();
        existingProject.setProjectName(projectDTO.getProjectName());
        existingProject.setStartDate(projectDTO.getStartDate());
        existingProject.setEndDate(projectDTO.getEndDate());
        existingProject.setManager(managerOpt.get());

        projectRepository.save(existingProject);
        return " Project updated successfully";
    }

    public String deleteProject(Long id) {
        return projectRepository.findById(id)
                .map(project -> {
                    projectRepository.delete(project);
                    return " Project deleted successfully";
                })
                .orElse(" Project not found with ID: " + id);
    }

    public List<Project> getProjectsByManagerId(Long managerId) {
        return userRepository.findById(managerId)
                .map(projectRepository::findByManager)
                .orElse(List.of());
    }
}
