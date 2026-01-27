package com.busapp.adapter.out.persistence;

import com.busapp.domain.Notification;
import com.busapp.domain.NotificationType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(NotificationPersistenceAdapter.class)
@DisplayName("NotificationPersistenceAdapter")
class NotificationPersistenceAdapterTest {

    @Autowired
    private NotificationPersistenceAdapter adapter;

    @Autowired
    private NotificationJpaRepository jpaRepository;

    @BeforeEach
    void setUp() {
        jpaRepository.deleteAll();
    }

    @Nested
    @DisplayName("save 메서드")
    class SaveTest {

        @Test
        @DisplayName("알림을 저장하고 ID가 부여된다")
        void saveNotification() {
            // given
            Notification notification = new Notification("파업 알림", "내일 파업 예정", NotificationType.STRIKE_ALERT);

            // when
            Notification saved = adapter.save(notification);

            // then
            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getTitle()).isEqualTo("파업 알림");
            assertThat(saved.getMessage()).isEqualTo("내일 파업 예정");
            assertThat(saved.getType()).isEqualTo(NotificationType.STRIKE_ALERT);
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("여러 알림을 저장할 수 있다")
        void saveMultipleNotifications() {
            // given
            Notification notification1 = new Notification("알림1", "메시지1", NotificationType.STRIKE_ALERT);
            Notification notification2 = new Notification("알림2", "메시지2", NotificationType.STRIKE_START);

            // when
            Notification saved1 = adapter.save(notification1);
            Notification saved2 = adapter.save(notification2);

            // then
            assertThat(saved1.getId()).isNotEqualTo(saved2.getId());
            assertThat(jpaRepository.count()).isEqualTo(2);
        }
    }

    @Nested
    @DisplayName("findAll 메서드")
    class FindAllTest {

        @Test
        @DisplayName("저장된 모든 알림을 조회한다")
        void findAllNotifications() {
            // given
            adapter.save(new Notification("알림1", "메시지1", NotificationType.STRIKE_ALERT));
            adapter.save(new Notification("알림2", "메시지2", NotificationType.STRIKE_START));
            adapter.save(new Notification("알림3", "메시지3", NotificationType.STRIKE_END));

            // when
            List<Notification> notifications = adapter.findAll();

            // then
            assertThat(notifications).hasSize(3);
        }

        @Test
        @DisplayName("알림이 없으면 빈 목록을 반환한다")
        void findAllWhenEmpty() {
            // when
            List<Notification> notifications = adapter.findAll();

            // then
            assertThat(notifications).isEmpty();
        }
    }
}
