package com.busapp.application.port.out;

import com.busapp.domain.Notification;

public interface FCMClient {
    void subscribeToTopic(String token, String topic);
    void unsubscribeFromTopic(String token, String topic);
    SendResult sendToTopic(String topic, Notification notification);

    record SendResult(boolean success, String messageId) {}
}
