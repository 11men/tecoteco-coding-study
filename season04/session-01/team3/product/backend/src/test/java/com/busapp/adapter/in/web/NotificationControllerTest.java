package com.busapp.adapter.in.web;

import com.busapp.application.port.in.SendNotificationUseCase;
import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
@DisplayName("NotificationController")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SendNotificationUseCase sendNotificationUseCase;

    @Nested
    @DisplayName("POST /api/notifications")
    class SendNotificationEndpointTest {

        @Test
        @DisplayName("유효한 요청으로 알림 발송 성공")
        void sendNotificationSuccess() throws Exception {
            // given
            String title = "파업 알림";
            String message = "내일 파업 예정";
            NotificationType type = NotificationType.STRIKE_ALERT;

            Notification notification = new Notification(1L, title, message, type, LocalDateTime.now());
            when(sendNotificationUseCase.send(eq(title), eq(message), eq(type))).thenReturn(notification);

            String requestBody = """
                    {
                        "title": "%s",
                        "message": "%s",
                        "type": "%s"
                    }
                    """.formatted(title, message, type.name());

            // when & then
            mockMvc.perform(post("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.title").value(title))
                    .andExpect(jsonPath("$.message").value(message))
                    .andExpect(jsonPath("$.type").value(type.name()))
                    .andExpect(jsonPath("$.createdAt").exists());

            verify(sendNotificationUseCase, times(1)).send(title, message, type);
        }

        @Test
        @DisplayName("제목 없이 요청하면 400 에러")
        void sendWithoutTitle() throws Exception {
            // given
            String requestBody = """
                    {
                        "message": "메시지",
                        "type": "STRIKE_ALERT"
                    }
                    """;

            // when & then
            mockMvc.perform(post("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());

            verify(sendNotificationUseCase, never()).send(any(), any(), any());
        }

        @Test
        @DisplayName("빈 제목으로 요청하면 400 에러")
        void sendWithEmptyTitle() throws Exception {
            // given
            String requestBody = """
                    {
                        "title": "",
                        "message": "메시지",
                        "type": "STRIKE_ALERT"
                    }
                    """;
            doThrow(new IllegalArgumentException("title must not be blank"))
                    .when(sendNotificationUseCase).send(eq(""), any(), any());

            // when & then
            mockMvc.perform(post("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("메시지 없이 요청하면 400 에러")
        void sendWithoutMessage() throws Exception {
            // given
            String requestBody = """
                    {
                        "title": "제목",
                        "type": "STRIKE_ALERT"
                    }
                    """;

            // when & then
            mockMvc.perform(post("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());

            verify(sendNotificationUseCase, never()).send(any(), any(), any());
        }

        @Test
        @DisplayName("타입 없이 요청하면 400 에러")
        void sendWithoutType() throws Exception {
            // given
            String requestBody = """
                    {
                        "title": "제목",
                        "message": "메시지"
                    }
                    """;

            // when & then
            mockMvc.perform(post("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());

            verify(sendNotificationUseCase, never()).send(any(), any(), any());
        }

        @Test
        @DisplayName("잘못된 타입으로 요청하면 400 에러")
        void sendWithInvalidType() throws Exception {
            // given
            String requestBody = """
                    {
                        "title": "제목",
                        "message": "메시지",
                        "type": "INVALID_TYPE"
                    }
                    """;

            // when & then
            mockMvc.perform(post("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());

            verify(sendNotificationUseCase, never()).send(any(), any(), any());
        }

        @Test
        @DisplayName("모든 알림 타입으로 발송할 수 있다")
        void sendAllNotificationTypes() throws Exception {
            for (NotificationType type : NotificationType.values()) {
                // given
                Notification notification = new Notification(1L, "제목", "메시지", type, LocalDateTime.now());
                when(sendNotificationUseCase.send(any(), any(), eq(type))).thenReturn(notification);

                String requestBody = """
                        {
                            "title": "제목",
                            "message": "메시지",
                            "type": "%s"
                        }
                        """.formatted(type.name());

                // when & then
                mockMvc.perform(post("/api/notifications")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.type").value(type.name()));
            }
        }
    }

    @Nested
    @DisplayName("GET /api/notifications")
    class GetAllNotificationsEndpointTest {

        @Test
        @DisplayName("알림 목록을 조회할 수 있다")
        void getAllNotifications() throws Exception {
            // given
            List<Notification> notifications = List.of(
                    new Notification(1L, "알림1", "메시지1", NotificationType.STRIKE_ALERT, LocalDateTime.of(2025, 1, 27, 10, 0)),
                    new Notification(2L, "알림2", "메시지2", NotificationType.STRIKE_START, LocalDateTime.of(2025, 1, 27, 11, 0))
            );
            when(sendNotificationUseCase.getAll()).thenReturn(notifications);

            // when & then
            mockMvc.perform(get("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(2)))
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].title").value("알림1"))
                    .andExpect(jsonPath("$[0].message").value("메시지1"))
                    .andExpect(jsonPath("$[0].type").value("STRIKE_ALERT"))
                    .andExpect(jsonPath("$[1].id").value(2))
                    .andExpect(jsonPath("$[1].title").value("알림2"));

            verify(sendNotificationUseCase, times(1)).getAll();
        }

        @Test
        @DisplayName("알림이 없으면 빈 배열을 반환한다")
        void getAllWhenEmpty() throws Exception {
            // given
            when(sendNotificationUseCase.getAll()).thenReturn(Collections.emptyList());

            // when & then
            mockMvc.perform(get("/api/notifications")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));

            verify(sendNotificationUseCase, times(1)).getAll();
        }
    }
}
