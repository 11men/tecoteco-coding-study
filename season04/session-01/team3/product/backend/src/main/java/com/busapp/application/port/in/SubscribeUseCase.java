package com.busapp.application.port.in;

public interface SubscribeUseCase {
    void subscribe(String token);
    void unsubscribe(String token);
}
