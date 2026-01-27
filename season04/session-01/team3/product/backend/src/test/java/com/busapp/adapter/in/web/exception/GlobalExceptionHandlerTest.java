package com.busapp.adapter.in.web.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@DisplayName("GlobalExceptionHandler")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("MethodArgumentNotValidException 처리시 400 응답을 반환한다")
    void handleValidationException() {
        // given
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError = new FieldError("request", "title", "title must not be blank");

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        // when
        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleValidationException(ex);

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(400);
        assertThat(response.getBody().message()).isEqualTo("Validation failed");
        assertThat(response.getBody().errors()).containsEntry("title", "title must not be blank");
    }

    @Test
    @DisplayName("IllegalArgumentException 처리시 400 응답을 반환한다")
    void handleIllegalArgumentException() {
        // given
        IllegalArgumentException ex = new IllegalArgumentException("token must not be blank");

        // when
        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleIllegalArgumentException(ex);

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(400);
        assertThat(response.getBody().message()).isEqualTo("token must not be blank");
    }

    @Test
    @DisplayName("HttpMessageNotReadableException 처리시 400 응답을 반환한다")
    void handleHttpMessageNotReadableException() {
        // given
        HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);

        // when
        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleHttpMessageNotReadableException(ex);

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(400);
        assertThat(response.getBody().message()).isEqualTo("Invalid request body");
    }

    @Test
    @DisplayName("ErrorResponse record가 올바르게 생성된다")
    void errorResponseCreation() {
        // when
        GlobalExceptionHandler.ErrorResponse response = new GlobalExceptionHandler.ErrorResponse(
                400, "Test message", null, null
        );

        // then
        assertThat(response.status()).isEqualTo(400);
        assertThat(response.message()).isEqualTo("Test message");
    }
}
