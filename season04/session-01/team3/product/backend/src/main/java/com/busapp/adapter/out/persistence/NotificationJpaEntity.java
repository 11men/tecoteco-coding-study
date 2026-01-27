package com.busapp.adapter.out.persistence;

import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class NotificationJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private LocalDateTime createdAt;

    protected NotificationJpaEntity() {}

    public NotificationJpaEntity(String title, String message, NotificationType type, LocalDateTime createdAt) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = createdAt;
    }

    public static NotificationJpaEntity from(Notification domain) {
        return new NotificationJpaEntity(domain.getTitle(), domain.getMessage(), domain.getType(), domain.getCreatedAt());
    }

    public Notification toDomain() {
        return new Notification(id, title, message, type, createdAt);
    }
}
