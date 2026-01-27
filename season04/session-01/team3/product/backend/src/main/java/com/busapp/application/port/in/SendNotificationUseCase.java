package com.busapp.application.port.in;

import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;

import java.util.List;

public interface SendNotificationUseCase {
    Notification send(String title, String message, NotificationType type);
    List<Notification> getAll();
}
