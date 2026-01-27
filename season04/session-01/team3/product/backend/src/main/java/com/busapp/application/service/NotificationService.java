package com.busapp.application.service;

import com.busapp.application.port.in.SendNotificationUseCase;
import com.busapp.application.port.out.FCMClient;
import com.busapp.application.port.out.NotificationRepository;
import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService implements SendNotificationUseCase {

    private static final String TOPIC_STRIKE = "strike-alerts";

    private final NotificationRepository notificationRepository;
    private final FCMClient fcmClient;

    public NotificationService(NotificationRepository notificationRepository, FCMClient fcmClient) {
        this.notificationRepository = notificationRepository;
        this.fcmClient = fcmClient;
    }

    @Override
    public Notification send(String title, String message, NotificationType type) {
        validateInput(title, message, type);

        Notification notification = new Notification(title, message, type);
        Notification saved = notificationRepository.save(notification);

        // 토픽으로 FCM 발송
        fcmClient.sendToTopic(TOPIC_STRIKE, saved);

        return saved;
    }

    @Override
    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    private void validateInput(String title, String message, NotificationType type) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("title must not be blank");
        }
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("message must not be blank");
        }
        if (type == null) {
            throw new IllegalArgumentException("type must not be null");
        }
    }
}
