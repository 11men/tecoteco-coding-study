package com.busapp.application.service;

import com.busapp.application.port.in.SubscribeUseCase;
import com.busapp.application.port.out.FCMClient;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionService implements SubscribeUseCase {

    private static final String TOPIC_STRIKE = "strike-alerts";

    private final FCMClient fcmClient;

    public SubscriptionService(FCMClient fcmClient) {
        this.fcmClient = fcmClient;
    }

    @Override
    public void subscribe(String token) {
        validateToken(token);
        fcmClient.subscribeToTopic(token, TOPIC_STRIKE);
    }

    @Override
    public void unsubscribe(String token) {
        validateToken(token);
        fcmClient.unsubscribeFromTopic(token, TOPIC_STRIKE);
    }

    private void validateToken(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("token must not be blank");
        }
    }
}
