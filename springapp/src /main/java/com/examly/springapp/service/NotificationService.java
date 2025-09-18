package com.examly.springapp.service;

import com.examly.springapp.dto.NotificationDTO;
import com.examly.springapp.model.Notification;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.NotificationRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private NotificationDTO toDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getUser().getUserId(),
                notification.getType(),
                notification.getMessage(),
                notification.getIsRead()
        );
    }

    public String addNotification(NotificationDTO notificationDTO) {
        User user = userRepository.findById(notificationDTO.getUserId()).orElse(null);
        if (user == null) return "Notification creation failed: User not found";

        Notification notification = new Notification(
                user,
                notificationDTO.getType(),
                notificationDTO.getMessage(),
                notificationDTO.getIsRead()
        );
        notificationRepository.save(notification);
        return "Notification created successfully with ID: " + notification.getId();
    }

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public NotificationDTO getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    public String updateNotification(Long id, NotificationDTO notificationDTO) {
        Notification existing = notificationRepository.findById(id).orElse(null);
        if (existing == null) return "Notification not found with ID: " + id;

        User user = userRepository.findById(notificationDTO.getUserId()).orElse(null);
        if (user == null) return "User not found with ID: " + notificationDTO.getUserId();

        existing.setUser(user);
        existing.setType(notificationDTO.getType());
        existing.setMessage(notificationDTO.getMessage());
        existing.setIsRead(notificationDTO.getIsRead());

        notificationRepository.save(existing);
        return "Notification updated successfully with ID: " + id;
    }

    public String deleteNotification(Long id) {
        Notification existing = notificationRepository.findById(id).orElse(null);
        if (existing == null) return "Notification not found with ID: " + id;

        notificationRepository.delete(existing);
        return "Notification deleted successfully with ID: " + id;
    }

    public List<NotificationDTO> getNotificationsByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();

        return notificationRepository.findByUser(user)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Methods for returning full entities (bulky JSON)
    public List<Notification> getAllNotificationsEntity() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationEntityById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public List<Notification> getNotificationsByUserIdEntity(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        return notificationRepository.findByUser(user);
    }
}
