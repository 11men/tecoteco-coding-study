package com.busapp.application.service;

import com.busapp.application.port.in.SendNotificationUseCase;
import com.busapp.application.port.out.NotificationRepository;
import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService implements SendNotificationUseCase {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Notification send(String title, String message, NotificationType type) {
        Notification notification = new Notification(title, message, type);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }
}
