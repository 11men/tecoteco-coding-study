package com.busapp.adapter.out.persistence;

import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("NotificationJpaEntity")
class NotificationJpaEntityTest {

    @Test
    @DisplayName("도메인 객체로부터 엔티티를 생성할 수 있다")
    void fromDomain() {
        // given
        Notification domain = new Notification("파업 알림", "내일 파업", NotificationType.STRIKE_ALERT);

        // when
        NotificationJpaEntity entity = NotificationJpaEntity.from(domain);

        // then
        assertThat(entity).isNotNull();
    }

    @Test
    @DisplayName("엔티티를 도메인 객체로 변환할 수 있다")
    void toDomain() {
        // given
        Notification original = new Notification(1L, "파업 알림", "내일 파업", NotificationType.STRIKE_ALERT, LocalDateTime.now());
        NotificationJpaEntity entity = NotificationJpaEntity.from(original);

        // when
        Notification domain = entity.toDomain();

        // then
        assertThat(domain.getTitle()).isEqualTo("파업 알림");
        assertThat(domain.getMessage()).isEqualTo("내일 파업");
        assertThat(domain.getType()).isEqualTo(NotificationType.STRIKE_ALERT);
    }
}
