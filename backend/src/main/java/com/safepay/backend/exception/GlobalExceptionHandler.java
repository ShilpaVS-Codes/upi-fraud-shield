
package com.safepay.backend.exception;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.safepay.backend.dto.ApiErrorResponse;
import com.safepay.backend.dto.ApiErrorResponse.FieldIssue;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        List<FieldIssue> issues = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldIssue(
                        error.getField(), error.getDefaultMessage()))
                .distinct()
                .sorted(Comparator.comparing(FieldIssue::field))
                .toList();

        return badRequest(
                "VALIDATION_FAILED",
                "Request validation failed. Fix the listed fields and try again.",
                issues);
    }

    @ExceptionHandler(InvalidTransactionException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidTransaction(
            InvalidTransactionException ex) {

        return badRequest(
                "VALIDATION_FAILED",
                "Request validation failed. Fix the listed fields and try again.",
                List.of(new FieldIssue(ex.getField(), ex.getMessage())));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableBody(
            HttpMessageNotReadableException ex) {

        return badRequest(
                "MALFORMED_REQUEST",
                "The request body could not be read. Check that it is valid JSON, "
                        + "that each field has the right type, and that it contains no unknown fields.",
                List.of());
    }

    private ResponseEntity<ApiErrorResponse> badRequest(
            String error, String message, List<FieldIssue> issues) {

        ApiErrorResponse body = new ApiErrorResponse(
                OffsetDateTime.now(ZoneOffset.UTC),
                HttpStatus.BAD_REQUEST.value(),
                error,
                message,
                issues);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
