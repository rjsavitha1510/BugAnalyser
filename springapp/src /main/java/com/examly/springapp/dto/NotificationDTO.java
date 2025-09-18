package com.examly.springapp.dto;

public class NotificationDTO {
    private Long id;
    private Long userId;
    private String type;
    private String message;
    private Boolean isRead;

    public NotificationDTO() {}

    public NotificationDTO(Long id, Long userId, String type, String message, Boolean isRead) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.message = message;
        this.isRead = isRead;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
