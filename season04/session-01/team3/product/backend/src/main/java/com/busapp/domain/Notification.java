package com.busapp.domain;

import java.time.LocalDateTime;

public class Notification {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private LocalDateTime createdAt;

    public Notification(String title, String message, NotificationType type) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }

    public Notification(Long id, String title, String message, NotificationType type, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public NotificationType getType() { return type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
