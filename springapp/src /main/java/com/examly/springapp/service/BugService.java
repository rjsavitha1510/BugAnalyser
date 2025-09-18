package com.examly.springapp.service;

import com.examly.springapp.dto.BugDTO;
import com.examly.springapp.dto.BugCreateDTO;
import com.examly.springapp.model.Bug;
import com.examly.springapp.model.Priority;
import com.examly.springapp.model.Project;
import com.examly.springapp.repository.BugRepository;
import com.examly.springapp.repository.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BugService {

    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;

    public BugService(BugRepository bugRepository, ProjectRepository projectRepository) {
        this.bugRepository = bugRepository;
        this.projectRepository = projectRepository;
    }
    public String addBug(BugCreateDTO bugCreateDTO) {
        if (bugCreateDTO.getProjectId() == null) {
            return "Project ID is required";
        }
        
        Project project = projectRepository.findById(bugCreateDTO.getProjectId()).orElse(null);
        if (project == null) return "Project not found with ID: " + bugCreateDTO.getProjectId();

        Bug bug = new Bug(bugCreateDTO.getTitle(), bugCreateDTO.getDescription(), bugCreateDTO.getPriority(), project);
        bugRepository.save(bug);
        return "Bug created successfully with ID: " + bug.getBugId();
    }
    
    public String addBug(BugDTO bugDTO) {
        if (bugDTO.getProjectId() == null) {
            return "Project ID is required";
        }
        
        Long projectId = bugDTO.getProjectId();
        
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return "Project not found with ID: " + projectId;

        Bug bug = new Bug(bugDTO.getTitle(), bugDTO.getDescription(), Priority.valueOf(bugDTO.getPriority()), project);
        bugRepository.save(bug);
        return "Bug created successfully with ID: " + bug.getBugId();
    }
    public List<BugDTO> getAllBugs() {
        return bugRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public BugDTO getBugById(Long bugId) {
        Bug bug = bugRepository.findById(bugId).orElse(null);
        return bug != null ? convertToDTO(bug) : null;
    }
    public String updateBug(Long bugId, BugCreateDTO bugCreateDTO) {
        Bug existingBug = bugRepository.findById(bugId).orElse(null);
        if (existingBug == null) return "Bug not found with ID: " + bugId;

        if (bugCreateDTO.getProjectId() == null) {
            return "Project ID is required";
        }
        
        Project project = projectRepository.findById(bugCreateDTO.getProjectId()).orElse(null);
        if (project == null) return "Project not found with ID: " + bugCreateDTO.getProjectId();

        existingBug.setTitle(bugCreateDTO.getTitle());
        existingBug.setDescription(bugCreateDTO.getDescription());
        existingBug.setPriority(bugCreateDTO.getPriority());
        existingBug.setProject(project);

        bugRepository.save(existingBug);
        return "Bug updated successfully with ID: " + existingBug.getBugId();
    }
    
    public String updateBug(Long bugId, BugDTO bugDTO) {
        Bug existingBug = bugRepository.findById(bugId).orElse(null);
        if (existingBug == null) return "Bug not found with ID: " + bugId;

        if (bugDTO.getProjectId() == null) {
            return "Project ID is required";
        }
        
        Long projectId = bugDTO.getProjectId();
        
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return "Project not found with ID: " + projectId;

        existingBug.setTitle(bugDTO.getTitle());
        existingBug.setDescription(bugDTO.getDescription());
        existingBug.setPriority(Priority.valueOf(bugDTO.getPriority()));
        existingBug.setProject(project);

        bugRepository.save(existingBug);
        return "Bug updated successfully with ID: " + existingBug.getBugId();
    }
    public String deleteBug(Long bugId) {
        Bug bug = bugRepository.findById(bugId).orElse(null);
        if (bug == null) return "Bug not found with ID: " + bugId;

        bugRepository.delete(bug);
        return "Bug deleted successfully with ID: " + bugId;
    }
    public List<BugDTO> getBugsByProject(Long projectId) {
        return bugRepository.findByProject_ProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Page<BugDTO> getAllBugsWithPagination(Pageable pageable) {
        return bugRepository.findAll(pageable).map(this::convertToDTO);
    }
    
    public Page<BugDTO> getBugsByPriority(Priority priority, Pageable pageable) {
        return bugRepository.findByPriority(priority, pageable).map(this::convertToDTO);
    }
    
    public Page<BugDTO> getBugsByProjectWithPagination(Long projectId, Pageable pageable) {
        return bugRepository.findByProject_ProjectId(projectId, pageable).map(this::convertToDTO);
    }

    private BugDTO convertToDTO(Bug bug) {
        BugDTO dto = new BugDTO(
                bug.getBugId(),
                bug.getTitle(),
                bug.getDescription(),
                bug.getPriority().toString(),
                bug.getProject() != null ? bug.getProject().getProjectId() : null,
                bug.getCreatedDate()
        );
        return dto;
    }
}
