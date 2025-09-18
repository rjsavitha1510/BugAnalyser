package com.examly.springapp.controller;

import com.examly.springapp.dto.QualityDTO;
import com.examly.springapp.model.Quality;
import com.examly.springapp.service.QualityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qualities")
@CrossOrigin
public class QualityController {

    private final QualityService qualityService;

    public QualityController(QualityService qualityService) {
        this.qualityService = qualityService;
    }

    // ✅ Add Quality (CRUD - ADMIN, DEVELOPER, TESTER only)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @PostMapping
    public ResponseEntity<String> addQuality(@RequestBody QualityDTO qualityDTO) {
        try {
            String result = qualityService.addQuality(qualityDTO);
            if (result.contains("successfully")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding quality: " + e.getMessage());
        }
    }

    // ✅ Get All Qualities (All roles can view)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping
    public ResponseEntity<List<Quality>> getAllQualities() {
        try {
            return ResponseEntity.ok(qualityService.getAllQualities());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Get Quality by ID (All roles can view)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/{id}")
    public ResponseEntity<Quality> getQualityById(@PathVariable Long id) {
        try {
            Quality quality = qualityService.getQualityById(id);
            if (quality == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(quality);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Update Quality (CRUD - ADMIN, DEVELOPER, TESTER only)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateQuality(@PathVariable Long id, @RequestBody QualityDTO qualityDTO) {
        try {
            String result = qualityService.updateQuality(id, qualityDTO);
            if (result.contains("updated successfully")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating quality: " + e.getMessage());
        }
    }

    // ✅ Delete Quality (CRUD - ADMIN, DEVELOPER, TESTER only)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuality(@PathVariable Long id) {
        try {
            String result = qualityService.deleteQuality(id);
            if (result.contains("deleted successfully")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting quality: " + e.getMessage());
        }
    }

    // ✅ Get Qualities by Project (All roles can view)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Quality>> getQualitiesByProject(@PathVariable Long projectId) {
        try {
            return ResponseEntity.ok(qualityService.getQualitiesByProject(projectId));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
