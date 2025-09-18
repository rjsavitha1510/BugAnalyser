package com.examly.springapp.controller;

import com.examly.springapp.dto.BugDTO;
import com.examly.springapp.dto.BugCreateDTO;
import com.examly.springapp.model.Priority;
import com.examly.springapp.service.BugService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    private final BugService bugService;

    public BugController(BugService bugService) {
        this.bugService = bugService;
    }

        @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_TESTER')")

    @PostMapping("/add")
    public ResponseEntity<String> addBug(@RequestBody BugCreateDTO bugCreateDTO) {
        try {
            String result = bugService.addBug(bugCreateDTO);
            if (result.contains("not found") || result.contains("required")) {
                return ResponseEntity.badRequest().body(result);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating bug: " + e.getMessage());
        }
    }

    // ✅ Get All Bugs: Admin, Developer, Tester, Stakeholder
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")

    @GetMapping
    public ResponseEntity<List<BugDTO>> getAllBugs() {
        List<BugDTO> bugs = bugService.getAllBugs();
        return ResponseEntity.ok(bugs);
    }

    // ✅ Get Bug by ID: Admin, Developer, Tester, Stakeholder
        @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")

    @GetMapping("/{id}")
    public ResponseEntity<BugDTO> getBugById(@PathVariable Long id) {
        BugDTO bug = bugService.getBugById(id);
        if (bug == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bug);
    }

    // ✅ Update Bug: Admin, Developer, Tester
        @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")

    @PutMapping("/{id}")
    public ResponseEntity<String> updateBug(@PathVariable Long id, @RequestBody BugCreateDTO bugCreateDTO) {
        try {
            String result = bugService.updateBug(id, bugCreateDTO);
            if (result.contains("not found") || result.contains("required")) {
                return ResponseEntity.badRequest().body(result);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating bug: " + e.getMessage());
        }
    }

    // ✅ Delete Bug: Only Admin
         @PreAuthorize("hasAuthority('ROLE_ADMIN')")

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBug(@PathVariable Long id) {
        String result = bugService.deleteBug(id);
        return ResponseEntity.ok(result);
    }

    // ✅ Get Bugs by Project: Admin, Developer, Tester, Stakeholder
     @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<BugDTO>> getBugsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(bugService.getBugsByProject(projectId));
    }
    
    // Get All Bugs with Pagination and Sorting
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/paginated")
    public ResponseEntity<Page<BugDTO>> getAllBugsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "priority") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(bugService.getAllBugsWithPagination(pageable));
    }
    
    // Filter Bugs by Priority with Pagination and Sorting
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/filter/priority/{priority}")
    public ResponseEntity<Page<BugDTO>> getBugsByPriority(
            @PathVariable Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "priority") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(bugService.getBugsByPriority(priority, pageable));
    }
    
    // Get Bugs by Project with Pagination and Sorting
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/project/{projectId}/paginated")
    public ResponseEntity<Page<BugDTO>> getBugsByProjectWithPagination(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "priority") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(bugService.getBugsByProjectWithPagination(projectId, pageable));
    }
}
