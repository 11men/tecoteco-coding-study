package com.busapp.adapter.in.web;

import com.busapp.application.port.in.SendNotificationUseCase;
import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NotificationController {

    private final SendNotificationUseCase sendNotificationUseCase;

    public NotificationController(SendNotificationUseCase sendNotificationUseCase) {
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> send(@RequestBody NotificationRequest request) {
        Notification notification = sendNotificationUseCase.send(
                request.title(), request.message(), request.type()
        );
        return ResponseEntity.ok(NotificationResponse.from(notification));
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAll() {
        List<NotificationResponse> responses = sendNotificationUseCase.getAll().stream()
                .map(NotificationResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    public record NotificationRequest(String title, String message, NotificationType type) {}

    public record NotificationResponse(Long id, String title, String message, NotificationType type, String createdAt) {
        public static NotificationResponse from(Notification n) {
            return new NotificationResponse(n.getId(), n.getTitle(), n.getMessage(), n.getType(), n.getCreatedAt().toString());
        }
    }
}
