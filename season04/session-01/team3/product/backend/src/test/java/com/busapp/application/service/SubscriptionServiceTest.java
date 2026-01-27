package com.busapp.application.service;

import com.busapp.application.port.out.FCMClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SubscriptionService")
class SubscriptionServiceTest {

    @Mock
    private FCMClient fcmClient;

    private SubscriptionService subscriptionService;

    private static final String TOPIC_STRIKE = "strike-alerts";

    @BeforeEach
    void setUp() {
        subscriptionService = new SubscriptionService(fcmClient);
    }

    @Nested
    @DisplayName("subscribe 메서드")
    class SubscribeTest {

        @Test
        @DisplayName("유효한 토큰으로 토픽을 구독할 수 있다")
        void subscribeWithValidToken() {
            // given
            String token = "valid-fcm-token-12345";

            // when
            subscriptionService.subscribe(token);

            // then
            verify(fcmClient, times(1)).subscribeToTopic(token, TOPIC_STRIKE);
        }

        @Test
        @DisplayName("null 토큰으로 구독하면 예외가 발생한다")
        void subscribeWithNullToken() {
            // when & then
            assertThatThrownBy(() -> subscriptionService.subscribe(null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("token");
        }

        @Test
        @DisplayName("빈 토큰으로 구독하면 예외가 발생한다")
        void subscribeWithEmptyToken() {
            // when & then
            assertThatThrownBy(() -> subscriptionService.subscribe(""))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("token");
        }

        @Test
        @DisplayName("공백만 있는 토큰으로 구독하면 예외가 발생한다")
        void subscribeWithBlankToken() {
            // when & then
            assertThatThrownBy(() -> subscriptionService.subscribe("   "))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("token");
        }
    }

    @Nested
    @DisplayName("unsubscribe 메서드")
    class UnsubscribeTest {

        @Test
        @DisplayName("유효한 토큰으로 토픽 구독을 해제할 수 있다")
        void unsubscribeWithValidToken() {
            // given
            String token = "valid-fcm-token-12345";

            // when
            subscriptionService.unsubscribe(token);

            // then
            verify(fcmClient, times(1)).unsubscribeFromTopic(token, TOPIC_STRIKE);
        }

        @Test
        @DisplayName("null 토큰으로 구독 해제하면 예외가 발생한다")
        void unsubscribeWithNullToken() {
            // when & then
            assertThatThrownBy(() -> subscriptionService.unsubscribe(null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("token");
        }

        @Test
        @DisplayName("빈 토큰으로 구독 해제하면 예외가 발생한다")
        void unsubscribeWithEmptyToken() {
            // when & then
            assertThatThrownBy(() -> subscriptionService.unsubscribe(""))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("token");
        }
    }
}
