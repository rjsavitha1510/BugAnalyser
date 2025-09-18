package com.examly.springapp.service;

import com.examly.springapp.dto.QualityDTO;
import com.examly.springapp.model.Project;
import com.examly.springapp.model.Quality;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.repository.QualityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QualityService {

    private final QualityRepository qualityRepository;
    private final ProjectRepository projectRepository;

    public QualityService(QualityRepository qualityRepository, ProjectRepository projectRepository) {
        this.qualityRepository = qualityRepository;
        this.projectRepository = projectRepository;
    }
    public String addQuality(QualityDTO qualityDTO) {
        Project project = projectRepository.findById(qualityDTO.getProjectId()).orElse(null);
        if (project == null) {
            return "Project not found with ID: " + qualityDTO.getProjectId();
        }
        Quality quality = new Quality(project, qualityDTO.getBugCount(), qualityDTO.getResolvedCount(), qualityDTO.getQualityScore(), qualityDTO.getCalculatedDate());
        qualityRepository.save(quality);
        return "Quality data added successfully with ID: " + quality.getMetricId();
    }
    public List<Quality> getAllQualities() {
        return qualityRepository.findAll();
    }
    public Quality getQualityById(Long id) {
        return qualityRepository.findById(id).orElse(null);
    }
    public String updateQuality(Long id, QualityDTO qualityDTO) {
        Quality existing = qualityRepository.findById(id).orElse(null);
        if (existing == null) {
            return "Quality data not found with ID: " + id;
        }

        Project project = projectRepository.findById(qualityDTO.getProjectId()).orElse(null);
        if (project == null) {
            return "Project not found with ID: " + qualityDTO.getProjectId();
        }

        existing.setProject(project);
        existing.setBugCount(qualityDTO.getBugCount());
        existing.setResolvedCount(qualityDTO.getResolvedCount());
        existing.setQualityScore(qualityDTO.getQualityScore());
        existing.setCalculatedDate(qualityDTO.getCalculatedDate());

        qualityRepository.save(existing);
        return "Quality data updated successfully with ID: " + id;
    }
    public String deleteQuality(Long id) {
        Quality existing = qualityRepository.findById(id).orElse(null);
        if (existing == null) {
            return "Quality data not found with ID: " + id;
        }
        qualityRepository.delete(existing);
        return "Quality data deleted successfully with ID: " + id;
    }
    public List<Quality> getQualitiesByProject(Long projectId) {
        return qualityRepository.findByProject_ProjectId(projectId);
    }
}
