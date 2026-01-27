package com.busapp.application.service;

import com.busapp.application.port.out.FCMClient;
import com.busapp.application.port.out.NotificationRepository;
import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationService")
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private FCMClient fcmClient;

    private NotificationService notificationService;

    private static final String TOPIC_STRIKE = "strike-alerts";

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(notificationRepository, fcmClient);
    }

    @Nested
    @DisplayName("send 메서드")
    class SendTest {

        @Test
        @DisplayName("알림을 저장하고 FCM으로 발송한다")
        void sendNotification() {
            // given
            String title = "파업 알림";
            String message = "내일 파업 예정";
            NotificationType type = NotificationType.STRIKE_ALERT;

            Notification savedNotification = new Notification(1L, title, message, type, LocalDateTime.now());
            when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);
            when(fcmClient.sendToTopic(eq(TOPIC_STRIKE), any(Notification.class)))
                    .thenReturn(new FCMClient.SendResult(true, "msg-123"));

            // when
            Notification result = notificationService.send(title, message, type);

            // then
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getTitle()).isEqualTo(title);
            assertThat(result.getMessage()).isEqualTo(message);
            assertThat(result.getType()).isEqualTo(type);

            verify(notificationRepository, times(1)).save(any(Notification.class));
            verify(fcmClient, times(1)).sendToTopic(eq(TOPIC_STRIKE), eq(savedNotification));
        }

        @Test
        @DisplayName("알림 저장 시 올바른 데이터가 전달된다")
        void sendNotificationWithCorrectData() {
            // given
            String title = "파업 시작";
            String message = "파업이 시작되었습니다";
            NotificationType type = NotificationType.STRIKE_START;

            ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
            Notification savedNotification = new Notification(1L, title, message, type, LocalDateTime.now());
            when(notificationRepository.save(captor.capture())).thenReturn(savedNotification);
            when(fcmClient.sendToTopic(any(), any())).thenReturn(new FCMClient.SendResult(true, "msg-123"));

            // when
            notificationService.send(title, message, type);

            // then
            Notification captured = captor.getValue();
            assertThat(captured.getTitle()).isEqualTo(title);
            assertThat(captured.getMessage()).isEqualTo(message);
            assertThat(captured.getType()).isEqualTo(type);
        }

        @Test
        @DisplayName("null title로 발송하면 예외가 발생한다")
        void sendWithNullTitle() {
            // when & then
            assertThatThrownBy(() -> notificationService.send(null, "message", NotificationType.STRIKE_ALERT))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("title");

            verify(notificationRepository, never()).save(any());
            verify(fcmClient, never()).sendToTopic(any(), any());
        }

        @Test
        @DisplayName("빈 title로 발송하면 예외가 발생한다")
        void sendWithEmptyTitle() {
            // when & then
            assertThatThrownBy(() -> notificationService.send("", "message", NotificationType.STRIKE_ALERT))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("title");

            verify(notificationRepository, never()).save(any());
            verify(fcmClient, never()).sendToTopic(any(), any());
        }

        @Test
        @DisplayName("null message로 발송하면 예외가 발생한다")
        void sendWithNullMessage() {
            // when & then
            assertThatThrownBy(() -> notificationService.send("title", null, NotificationType.STRIKE_ALERT))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("message");

            verify(notificationRepository, never()).save(any());
        }

        @Test
        @DisplayName("null type으로 발송하면 예외가 발생한다")
        void sendWithNullType() {
            // when & then
            assertThatThrownBy(() -> notificationService.send("title", "message", null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("type");

            verify(notificationRepository, never()).save(any());
        }

        @Test
        @DisplayName("FCM 발송 실패해도 알림은 저장된다")
        void sendWhenFCMFails() {
            // given
            String title = "파업 알림";
            String message = "내일 파업 예정";
            NotificationType type = NotificationType.STRIKE_ALERT;

            Notification savedNotification = new Notification(1L, title, message, type, LocalDateTime.now());
            when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);
            when(fcmClient.sendToTopic(any(), any())).thenReturn(new FCMClient.SendResult(false, null));

            // when
            Notification result = notificationService.send(title, message, type);

            // then
            assertThat(result).isNotNull();
            verify(notificationRepository, times(1)).save(any());
        }
    }

    @Nested
    @DisplayName("getAll 메서드")
    class GetAllTest {

        @Test
        @DisplayName("모든 알림 목록을 조회할 수 있다")
        void getAllNotifications() {
            // given
            List<Notification> notifications = List.of(
                    new Notification(1L, "알림1", "메시지1", NotificationType.STRIKE_ALERT, LocalDateTime.now()),
                    new Notification(2L, "알림2", "메시지2", NotificationType.STRIKE_START, LocalDateTime.now()),
                    new Notification(3L, "알림3", "메시지3", NotificationType.STRIKE_END, LocalDateTime.now())
            );
            when(notificationRepository.findAll()).thenReturn(notifications);

            // when
            List<Notification> result = notificationService.getAll();

            // then
            assertThat(result).hasSize(3);
            assertThat(result.get(0).getTitle()).isEqualTo("알림1");
            assertThat(result.get(1).getTitle()).isEqualTo("알림2");
            assertThat(result.get(2).getTitle()).isEqualTo("알림3");
            verify(notificationRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("알림이 없으면 빈 목록을 반환한다")
        void getAllWhenEmpty() {
            // given
            when(notificationRepository.findAll()).thenReturn(Collections.emptyList());

            // when
            List<Notification> result = notificationService.getAll();

            // then
            assertThat(result).isEmpty();
            verify(notificationRepository, times(1)).findAll();
        }
    }
}
