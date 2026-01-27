package com.busapp.adapter.out.fcm;

import com.busapp.application.port.out.FCMClient;
import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@DisplayName("FCMAdapter")
class FCMAdapterTest {

    private FCMAdapter fcmAdapter;

    @BeforeEach
    void setUp() {
        fcmAdapter = new FCMAdapter();
    }

    @Nested
    @DisplayName("subscribeToTopic 메서드")
    class SubscribeToTopicTest {

        @Test
        @DisplayName("토픽 구독이 성공하면 로그가 출력된다")
        void subscribeSuccess() throws Exception {
            // given
            String token = "test-token";
            String topic = "strike-alerts";

            try (MockedStatic<FirebaseMessaging> mockedStatic = mockStatic(FirebaseMessaging.class)) {
                FirebaseMessaging firebaseMessaging = mock(FirebaseMessaging.class);
                TopicManagementResponse response = mock(TopicManagementResponse.class);

                mockedStatic.when(FirebaseMessaging::getInstance).thenReturn(firebaseMessaging);
                when(firebaseMessaging.subscribeToTopic(eq(List.of(token)), eq(topic))).thenReturn(response);

                // when
                fcmAdapter.subscribeToTopic(token, topic);

                // then
                verify(firebaseMessaging, times(1)).subscribeToTopic(eq(List.of(token)), eq(topic));
            }
        }

        @Test
        @DisplayName("토픽 구독이 실패해도 예외가 발생하지 않는다")
        void subscribeFailure() throws Exception {
            // given
            String token = "test-token";
            String topic = "strike-alerts";

            try (MockedStatic<FirebaseMessaging> mockedStatic = mockStatic(FirebaseMessaging.class)) {
                FirebaseMessaging firebaseMessaging = mock(FirebaseMessaging.class);
                mockedStatic.when(FirebaseMessaging::getInstance).thenReturn(firebaseMessaging);
                when(firebaseMessaging.subscribeToTopic(any(), any()))
                        .thenThrow(mock(FirebaseMessagingException.class));

                // when & then (no exception)
                fcmAdapter.subscribeToTopic(token, topic);
            }
        }
    }

    @Nested
    @DisplayName("unsubscribeFromTopic 메서드")
    class UnsubscribeFromTopicTest {

        @Test
        @DisplayName("토픽 구독 해제가 성공하면 로그가 출력된다")
        void unsubscribeSuccess() throws Exception {
            // given
            String token = "test-token";
            String topic = "strike-alerts";

            try (MockedStatic<FirebaseMessaging> mockedStatic = mockStatic(FirebaseMessaging.class)) {
                FirebaseMessaging firebaseMessaging = mock(FirebaseMessaging.class);
                TopicManagementResponse response = mock(TopicManagementResponse.class);

                mockedStatic.when(FirebaseMessaging::getInstance).thenReturn(firebaseMessaging);
                when(firebaseMessaging.unsubscribeFromTopic(eq(List.of(token)), eq(topic))).thenReturn(response);

                // when
                fcmAdapter.unsubscribeFromTopic(token, topic);

                // then
                verify(firebaseMessaging, times(1)).unsubscribeFromTopic(eq(List.of(token)), eq(topic));
            }
        }

        @Test
        @DisplayName("토픽 구독 해제가 실패해도 예외가 발생하지 않는다")
        void unsubscribeFailure() throws Exception {
            // given
            String token = "test-token";
            String topic = "strike-alerts";

            try (MockedStatic<FirebaseMessaging> mockedStatic = mockStatic(FirebaseMessaging.class)) {
                FirebaseMessaging firebaseMessaging = mock(FirebaseMessaging.class);
                mockedStatic.when(FirebaseMessaging::getInstance).thenReturn(firebaseMessaging);
                when(firebaseMessaging.unsubscribeFromTopic(any(), any()))
                        .thenThrow(mock(FirebaseMessagingException.class));

                // when & then (no exception)
                fcmAdapter.unsubscribeFromTopic(token, topic);
            }
        }
    }

    @Nested
    @DisplayName("sendToTopic 메서드")
    class SendToTopicTest {

        @Test
        @DisplayName("메시지 발송이 성공하면 SendResult(true)를 반환한다")
        void sendSuccess() throws Exception {
            // given
            String topic = "strike-alerts";
            Notification notification = new Notification(1L, "파업 알림", "내일 파업", NotificationType.STRIKE_ALERT, LocalDateTime.now());

            try (MockedStatic<FirebaseMessaging> mockedStatic = mockStatic(FirebaseMessaging.class)) {
                FirebaseMessaging firebaseMessaging = mock(FirebaseMessaging.class);
                mockedStatic.when(FirebaseMessaging::getInstance).thenReturn(firebaseMessaging);
                when(firebaseMessaging.send(any(Message.class))).thenReturn("message-id-123");

                // when
                FCMClient.SendResult result = fcmAdapter.sendToTopic(topic, notification);

                // then
                assertThat(result.success()).isTrue();
                assertThat(result.messageId()).isEqualTo("message-id-123");
            }
        }

        @Test
        @DisplayName("메시지 발송이 실패하면 SendResult(false)를 반환한다")
        void sendFailure() throws Exception {
            // given
            String topic = "strike-alerts";
            Notification notification = new Notification(1L, "파업 알림", "내일 파업", NotificationType.STRIKE_ALERT, LocalDateTime.now());

            try (MockedStatic<FirebaseMessaging> mockedStatic = mockStatic(FirebaseMessaging.class)) {
                FirebaseMessaging firebaseMessaging = mock(FirebaseMessaging.class);
                mockedStatic.when(FirebaseMessaging::getInstance).thenReturn(firebaseMessaging);
                when(firebaseMessaging.send(any(Message.class)))
                        .thenThrow(mock(FirebaseMessagingException.class));

                // when
                FCMClient.SendResult result = fcmAdapter.sendToTopic(topic, notification);

                // then
                assertThat(result.success()).isFalse();
                assertThat(result.messageId()).isNull();
            }
        }
    }
}
