package com.busapp.adapter.out.fcm;

import com.busapp.application.port.out.FCMClient;
import com.busapp.domain.Notification;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FCMAdapter implements FCMClient {

    private static final Logger log = LoggerFactory.getLogger(FCMAdapter.class);

    @Override
    public void subscribeToTopic(String token, String topic) {
        try {
            FirebaseMessaging.getInstance().subscribeToTopic(List.of(token), topic);
            log.info("토픽 구독 완료: topic={}", topic);
        } catch (FirebaseMessagingException e) {
            log.error("토픽 구독 실패", e);
        }
    }

    @Override
    public void unsubscribeFromTopic(String token, String topic) {
        try {
            FirebaseMessaging.getInstance().unsubscribeFromTopic(List.of(token), topic);
            log.info("토픽 구독 해제: topic={}", topic);
        } catch (FirebaseMessagingException e) {
            log.error("토픽 구독 해제 실패", e);
        }
    }

    @Override
    public SendResult sendToTopic(String topic, Notification notification) {
        Message message = Message.builder()
                .setTopic(topic)
                .setNotification(com.google.firebase.messaging.Notification.builder()
                        .setTitle(notification.getTitle())
                        .setBody(notification.getMessage())
                        .build())
                .putData("type", notification.getType().name())
                .putData("notificationId", String.valueOf(notification.getId()))
                .build();

        try {
            String messageId = FirebaseMessaging.getInstance().send(message);
            log.info("토픽 알림 발송 완료: topic={}, messageId={}", topic, messageId);
            return new SendResult(true, messageId);
        } catch (FirebaseMessagingException e) {
            log.error("토픽 알림 발송 실패", e);
            return new SendResult(false, null);
        }
    }
}
