package com.busapp.integration;

import com.busapp.application.port.out.FCMClient;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Subscription Integration Tests")
class SubscriptionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FCMClient fcmClient;

    @Test
    @DisplayName("토픽 구독 후 구독 해제까지 전체 플로우")
    void subscribeAndUnsubscribeFlow() throws Exception {
        // given
        String token = "test-fcm-token-12345";
        String subscribeRequest = """
                {"token": "%s"}
                """.formatted(token);

        // when - 구독
        mockMvc.perform(post("/api/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(subscribeRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("토픽 구독 완료"));

        verify(fcmClient, times(1)).subscribeToTopic(token, "strike-alerts");

        // when - 구독 해제
        mockMvc.perform(delete("/api/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(subscribeRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("토픽 구독 해제"));

        verify(fcmClient, times(1)).unsubscribeFromTopic(token, "strike-alerts");
    }

    @Test
    @DisplayName("빈 토큰으로 구독 시도시 400 에러")
    void subscribeWithEmptyTokenFails() throws Exception {
        // given
        String requestBody = """
                {"token": ""}
                """;

        // when & then
        mockMvc.perform(post("/api/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));

        verify(fcmClient, never()).subscribeToTopic(any(), any());
    }

    @Test
    @DisplayName("토큰 없이 구독 시도시 400 에러")
    void subscribeWithoutTokenFails() throws Exception {
        // given
        String requestBody = """
                {}
                """;

        // when & then
        mockMvc.perform(post("/api/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());

        verify(fcmClient, never()).subscribeToTopic(any(), any());
    }
}
