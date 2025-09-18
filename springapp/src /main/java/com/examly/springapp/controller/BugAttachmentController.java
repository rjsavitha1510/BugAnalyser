package com.examly.springapp.controller;

import com.examly.springapp.dto.BugAttachmentDTO;
import com.examly.springapp.model.Bug;
import com.examly.springapp.model.BugAttachment;
import com.examly.springapp.service.BugAttachmentService;
import com.examly.springapp.service.BugService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bugattachments")
@CrossOrigin
public class BugAttachmentController {

    private final BugAttachmentService bugAttachmentService;
    private final BugService bugService;

    public BugAttachmentController(BugAttachmentService bugAttachmentService, BugService bugService) {
        this.bugAttachmentService = bugAttachmentService;
        this.bugService = bugService;
    }

    // ✅ Upload Attachment (CRUD - ADMIN, DEVELOPER, TESTER only)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @PostMapping(value = "/{bugId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadAttachment(
            @PathVariable Long bugId,
            @RequestParam("file") MultipartFile file,
            @RequestParam String uploadedBy) {

        try {
            if (bugService.getBugById(bugId) == null) {
                return ResponseEntity.badRequest().body("Bug not found with ID " + bugId);
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }

            BugAttachmentDTO dto = new BugAttachmentDTO();
            dto.setBugId(bugId);
            dto.setFileName(file.getOriginalFilename());
            dto.setFilePath("uploads/" + file.getOriginalFilename());
            dto.setUploadedBy(uploadedBy);
            dto.setUploadedDate(LocalDateTime.now());
            dto.setFileType(file.getContentType());
            dto.setFileSize(file.getSize());

            bugAttachmentService.saveAttachment(dto);
            return ResponseEntity.ok("Attachment uploaded successfully for Bug ID " + bugId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

    // ✅ Get All Attachments (All roles can view)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping
    public ResponseEntity<List<BugAttachment>> getAllAttachments() {
        return ResponseEntity.ok(bugAttachmentService.getAllAttachmentsEntity());
    }

    // ✅ Get Attachment by ID (All roles can view)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/{id}")
    public ResponseEntity<BugAttachment> getAttachmentById(@PathVariable Long id) {
        BugAttachment attachment = bugAttachmentService.getAttachmentEntityById(id);
        if (attachment == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(attachment);
    }

    // ✅ Get Attachments by Bug ID (All roles can view)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/bug/{bugId}")
    public ResponseEntity<List<BugAttachment>> getAttachmentsByBug(@PathVariable Long bugId) {
        if (bugService.getBugById(bugId) == null) return ResponseEntity.badRequest().build();
        Bug bug = new Bug();
        bug.setBugId(bugId);
        return ResponseEntity.ok(bugAttachmentService.getAttachmentsByBugEntity(bug));
    }

    // ✅ Delete Attachment (CRUD - ADMIN, DEVELOPER, TESTER only)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttachment(@PathVariable Long id) {
        String result = bugAttachmentService.deleteAttachment(id);
        if (result.contains("not found")) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }
}
