package com.examly.springapp.service;

import com.examly.springapp.dto.BugAttachmentDTO;
import com.examly.springapp.model.Bug;
import com.examly.springapp.model.BugAttachment;
import com.examly.springapp.repository.BugAttachmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BugAttachmentService {

    private final BugAttachmentRepository bugAttachmentRepository;

    public BugAttachmentService(BugAttachmentRepository bugAttachmentRepository) {
        this.bugAttachmentRepository = bugAttachmentRepository;
    }

    // Convert entity to DTO
    private BugAttachmentDTO toDTO(BugAttachment attachment) {
        return new BugAttachmentDTO(
                attachment.getAttachmentId(),
                attachment.getBug().getBugId(),
                attachment.getFileName(),
                attachment.getFilePath(),
                attachment.getUploadedBy(),
                attachment.getUploadedDate(),
                attachment.getFileType(),
                attachment.getFileSize()
        );
    }

    // Add / Save Attachment
    public BugAttachmentDTO saveAttachment(BugAttachmentDTO dto) {
        Bug bug = new Bug();
        bug.setBugId(dto.getBugId());

        BugAttachment attachment = new BugAttachment();
        attachment.setBug(bug);
        attachment.setFileName(dto.getFileName());
        attachment.setFilePath(dto.getFilePath());
        attachment.setUploadedBy(dto.getUploadedBy());
        attachment.setUploadedDate(dto.getUploadedDate() != null ? dto.getUploadedDate() : LocalDateTime.now());
        attachment.setFileType(dto.getFileType());
        attachment.setFileSize(dto.getFileSize());

        BugAttachment saved = bugAttachmentRepository.save(attachment);
        return toDTO(saved);
    }

    // Get All Attachments
    public List<BugAttachmentDTO> getAllAttachments() {
        return bugAttachmentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get by ID
    public BugAttachmentDTO getAttachmentById(Long id) {
        BugAttachment attachment = bugAttachmentRepository.findById(id).orElse(null);
        return attachment != null ? toDTO(attachment) : null;
    }

    // Get Attachments by Bug
    public List<BugAttachmentDTO> getAttachmentsByBug(Bug bug) {
        return bugAttachmentRepository.findByBug(bug)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Delete
    public String deleteAttachment(Long id) {
        BugAttachment attachment = bugAttachmentRepository.findById(id).orElse(null);
        if (attachment == null) return "Attachment not found with ID " + id;

        bugAttachmentRepository.delete(attachment);
        return "Attachment with ID " + id + " deleted successfully";
    }

    // Get All Attachments (Full Entities)
    public List<BugAttachment> getAllAttachmentsEntity() {
        return bugAttachmentRepository.findAll();
    }

    // Get by ID (Full Entity)
    public BugAttachment getAttachmentEntityById(Long id) {
        return bugAttachmentRepository.findById(id).orElse(null);
    }

    // Get Attachments by Bug (Full Entities)
    public List<BugAttachment> getAttachmentsByBugEntity(Bug bug) {
        return bugAttachmentRepository.findByBug(bug);
    }
}
