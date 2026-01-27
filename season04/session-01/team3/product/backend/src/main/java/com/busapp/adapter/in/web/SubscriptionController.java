package com.busapp.adapter.in.web;

import com.busapp.application.port.in.SubscribeUseCase;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SubscriptionController {

    private final SubscribeUseCase subscribeUseCase;

    public SubscriptionController(SubscribeUseCase subscribeUseCase) {
        this.subscribeUseCase = subscribeUseCase;
    }

    @PostMapping
    public ResponseEntity<Response> subscribe(@Valid @RequestBody SubscribeRequest request) {
        subscribeUseCase.subscribe(request.token());
        return ResponseEntity.ok(new Response(true, "토픽 구독 완료"));
    }

    @DeleteMapping
    public ResponseEntity<Response> unsubscribe(@Valid @RequestBody SubscribeRequest request) {
        subscribeUseCase.unsubscribe(request.token());
        return ResponseEntity.ok(new Response(true, "토픽 구독 해제"));
    }

    public record SubscribeRequest(@NotBlank(message = "token must not be blank") String token) {}
    public record Response(boolean success, String message) {}
}
