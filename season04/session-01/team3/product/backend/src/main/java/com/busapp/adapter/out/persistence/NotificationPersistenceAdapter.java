package com.busapp.adapter.out.persistence;

import com.busapp.application.port.out.NotificationRepository;
import com.busapp.domain.Notification;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class NotificationPersistenceAdapter implements NotificationRepository {

    private final NotificationJpaRepository jpaRepository;

    public NotificationPersistenceAdapter(NotificationJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Notification save(Notification notification) {
        NotificationJpaEntity entity = NotificationJpaEntity.from(notification);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    public List<Notification> findAll() {
        return jpaRepository.findAll().stream()
                .map(NotificationJpaEntity::toDomain)
                .toList();
    }
}
