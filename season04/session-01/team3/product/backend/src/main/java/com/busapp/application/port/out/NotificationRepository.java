package com.busapp.application.port.out;

import com.busapp.domain.Notification;

import java.util.List;

public interface NotificationRepository {
    Notification save(Notification notification);
    List<Notification> findAll();
}
