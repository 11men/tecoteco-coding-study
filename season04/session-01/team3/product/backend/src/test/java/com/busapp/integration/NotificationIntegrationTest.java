package com.busapp.integration;

import com.busapp.adapter.out.persistence.NotificationJpaRepository;
import com.busapp.application.port.out.FCMClient;
import com.busapp.domain.NotificationType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Notification Integration Tests")
class NotificationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NotificationJpaRepository notificationJpaRepository;

    @MockBean
    private FCMClient fcmClient;

    @BeforeEach
    void setUp() {
        notificationJpaRepository.deleteAll();
        when(fcmClient.sendToTopic(any(), any()))
                .thenReturn(new FCMClient.SendResult(true, "test-message-id"));
    }

    @Test
    @DisplayName("알림을 발송하고 DB에 저장한다")
    void sendNotificationAndPersist() throws Exception {
        // given
        String requestBody = """
                {
                    "title": "파업 알림",
                    "message": "내일 버스 파업 예정입니다",
                    "type": "STRIKE_ALERT"
                }
                """;

        // when
        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("파업 알림"))
                .andExpect(jsonPath("$.message").value("내일 버스 파업 예정입니다"))
                .andExpect(jsonPath("$.type").value("STRIKE_ALERT"));

        // then
        assertThat(notificationJpaRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("여러 알림을 발송하고 목록을 조회한다")
    void sendMultipleAndGetAll() throws Exception {
        // given - 3개의 알림 발송
        for (NotificationType type : new NotificationType[]{
                NotificationType.STRIKE_ALERT,
                NotificationType.STRIKE_START,
                NotificationType.STRIKE_END
        }) {
            String requestBody = """
                    {
                        "title": "알림 %s",
                        "message": "메시지 %s",
                        "type": "%s"
                    }
                    """.formatted(type.name(), type.name(), type.name());

            mockMvc.perform(post("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isOk());
        }

        // when & then
        mockMvc.perform(get("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    @DisplayName("잘못된 요청시 400 에러와 에러 메시지를 반환한다")
    void badRequestReturnsErrorResponse() throws Exception {
        // given
        String requestBody = """
                {
                    "title": "",
                    "message": "메시지",
                    "type": "STRIKE_ALERT"
                }
                """;

        // when & then
        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.title").exists());
    }
}
