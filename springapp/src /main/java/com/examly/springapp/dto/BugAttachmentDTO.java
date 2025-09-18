package com.examly.springapp.dto;

import java.time.LocalDateTime;

public class BugAttachmentDTO {

    private Long attachmentId;
    private Long bugId;   // instead of full Bug object, just the ID
    private String fileName;
    private String filePath;
    private String uploadedBy;
    private LocalDateTime uploadedDate;
    private String fileType;
    private Long fileSize;

    public BugAttachmentDTO() {}

    public BugAttachmentDTO(Long attachmentId, Long bugId, String fileName,
                            String filePath, String uploadedBy, LocalDateTime uploadedDate,
                            String fileType, Long fileSize) {
        this.attachmentId = attachmentId;
        this.bugId = bugId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.uploadedBy = uploadedBy;
        this.uploadedDate = uploadedDate;
        this.fileType = fileType;
        this.fileSize = fileSize;
    }

    public Long getAttachmentId() { return attachmentId; }
    public void setAttachmentId(Long attachmentId) { this.attachmentId = attachmentId; }

    public Long getBugId() { return bugId; }
    public void setBugId(Long bugId) { this.bugId = bugId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public LocalDateTime getUploadedDate() { return uploadedDate; }
    public void setUploadedDate(LocalDateTime uploadedDate) { this.uploadedDate = uploadedDate; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
}
