package com.busapp.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Notification 도메인")
class NotificationTest {

    @Nested
    @DisplayName("생성 테스트")
    class CreateTest {

        @Test
        @DisplayName("제목, 메시지, 타입으로 알림을 생성할 수 있다")
        void createNotification() {
            // given
            String title = "파업 알림";
            String message = "내일 버스 파업이 예정되어 있습니다";
            NotificationType type = NotificationType.STRIKE_ALERT;

            // when
            Notification notification = new Notification(title, message, type);

            // then
            assertThat(notification.getTitle()).isEqualTo(title);
            assertThat(notification.getMessage()).isEqualTo(message);
            assertThat(notification.getType()).isEqualTo(type);
            assertThat(notification.getCreatedAt()).isNotNull();
            assertThat(notification.getId()).isNull();
        }

        @Test
        @DisplayName("ID를 포함한 모든 필드로 알림을 생성할 수 있다")
        void createNotificationWithId() {
            // given
            Long id = 1L;
            String title = "파업 시작";
            String message = "버스 파업이 시작되었습니다";
            NotificationType type = NotificationType.STRIKE_START;
            LocalDateTime createdAt = LocalDateTime.of(2025, 1, 27, 10, 0);

            // when
            Notification notification = new Notification(id, title, message, type, createdAt);

            // then
            assertThat(notification.getId()).isEqualTo(id);
            assertThat(notification.getTitle()).isEqualTo(title);
            assertThat(notification.getMessage()).isEqualTo(message);
            assertThat(notification.getType()).isEqualTo(type);
            assertThat(notification.getCreatedAt()).isEqualTo(createdAt);
        }

        @Test
        @DisplayName("null title로 생성하면 예외가 발생한다")
        void createWithNullTitle() {
            // when & then
            assertThatThrownBy(() -> new Notification(null, "message", NotificationType.STRIKE_ALERT))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("title");
        }

        @Test
        @DisplayName("빈 title로 생성하면 예외가 발생한다")
        void createWithEmptyTitle() {
            // when & then
            assertThatThrownBy(() -> new Notification("", "message", NotificationType.STRIKE_ALERT))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("title");
        }

        @Test
        @DisplayName("null message로 생성하면 예외가 발생한다")
        void createWithNullMessage() {
            // when & then
            assertThatThrownBy(() -> new Notification("title", null, NotificationType.STRIKE_ALERT))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("message");
        }

        @Test
        @DisplayName("null type으로 생성하면 예외가 발생한다")
        void createWithNullType() {
            // when & then
            assertThatThrownBy(() -> new Notification("title", "message", null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("type");
        }
    }

    @Nested
    @DisplayName("NotificationType 테스트")
    class NotificationTypeTest {

        @Test
        @DisplayName("모든 알림 타입이 정의되어 있다")
        void allTypesExist() {
            assertThat(NotificationType.values())
                    .containsExactlyInAnyOrder(
                            NotificationType.STRIKE_ALERT,
                            NotificationType.STRIKE_START,
                            NotificationType.STRIKE_END,
                            NotificationType.NEGOTIATION
                    );
        }
    }
}
