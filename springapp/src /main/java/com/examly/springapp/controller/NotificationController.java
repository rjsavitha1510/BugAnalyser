package com.examly.springapp.controller;

import com.examly.springapp.dto.NotificationDTO;
import com.examly.springapp.model.Notification;
import com.examly.springapp.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @PostMapping
    public ResponseEntity<String> createNotification(@RequestBody NotificationDTO notificationDTO) {
        try {
            String result = notificationService.addNotification(notificationDTO);
            if (result.contains("successfully")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating notification: " + e.getMessage());
        }
    }
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        try {
            return ResponseEntity.ok(notificationService.getAllNotificationsEntity());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        try {
            Notification notification = notificationService.getNotificationEntityById(id);
            if (notification == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateNotification(@PathVariable Long id, @RequestBody NotificationDTO notificationDTO) {
        try {
            String result = notificationService.updateNotification(id, notificationDTO);
            if (result.contains("successfully")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating notification: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        try {
            String result = notificationService.deleteNotification(id);
            if (result.contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting notification: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_DEVELOPER','ROLE_TESTER','ROLE_STAKEHOLDER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(notificationService.getNotificationsByUserIdEntity(userId));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
