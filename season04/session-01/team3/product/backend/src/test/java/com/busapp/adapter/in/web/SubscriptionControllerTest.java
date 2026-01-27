package com.busapp.adapter.in.web;

import com.busapp.application.port.in.SubscribeUseCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SubscriptionController.class)
@DisplayName("SubscriptionController")
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SubscribeUseCase subscribeUseCase;

    @Nested
    @DisplayName("POST /api/subscriptions")
    class SubscribeEndpointTest {

        @Test
        @DisplayName("유효한 토큰으로 구독 성공")
        void subscribeSuccess() throws Exception {
            // given
            String token = "valid-fcm-token-12345";
            String requestBody = """
                    {"token": "%s"}
                    """.formatted(token);

            // when & then
            mockMvc.perform(post("/api/subscriptions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").exists());

            verify(subscribeUseCase, times(1)).subscribe(token);
        }

        @Test
        @DisplayName("토큰 없이 요청하면 400 에러")
        void subscribeWithoutToken() throws Exception {
            // given
            String requestBody = """
                    {}
                    """;

            // when & then
            mockMvc.perform(post("/api/subscriptions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());

            verify(subscribeUseCase, never()).subscribe(any());
        }

        @Test
        @DisplayName("빈 토큰으로 요청하면 400 에러")
        void subscribeWithEmptyToken() throws Exception {
            // given
            String requestBody = """
                    {"token": ""}
                    """;
            doThrow(new IllegalArgumentException("token must not be blank"))
                    .when(subscribeUseCase).subscribe("");

            // when & then
            mockMvc.perform(post("/api/subscriptions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("null 토큰으로 요청하면 400 에러")
        void subscribeWithNullToken() throws Exception {
            // given
            String requestBody = """
                    {"token": null}
                    """;

            // when & then
            mockMvc.perform(post("/api/subscriptions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());

            verify(subscribeUseCase, never()).subscribe(any());
        }
    }

    @Nested
    @DisplayName("DELETE /api/subscriptions")
    class UnsubscribeEndpointTest {

        @Test
        @DisplayName("유효한 토큰으로 구독 해제 성공")
        void unsubscribeSuccess() throws Exception {
            // given
            String token = "valid-fcm-token-12345";
            String requestBody = """
                    {"token": "%s"}
                    """.formatted(token);

            // when & then
            mockMvc.perform(delete("/api/subscriptions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").exists());

            verify(subscribeUseCase, times(1)).unsubscribe(token);
        }

        @Test
        @DisplayName("토큰 없이 요청하면 400 에러")
        void unsubscribeWithoutToken() throws Exception {
            // given
            String requestBody = """
                    {}
                    """;

            // when & then
            mockMvc.perform(delete("/api/subscriptions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());

            verify(subscribeUseCase, never()).unsubscribe(any());
        }
    }
}
