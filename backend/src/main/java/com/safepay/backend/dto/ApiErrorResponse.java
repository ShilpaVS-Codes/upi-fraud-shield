
package com.safepay.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record ApiErrorResponse(
        OffsetDateTime timestamp,
        int status,
        String error,
        String message,
        List<FieldIssue> fieldErrors
) {

    public record FieldIssue(String field, String message) {
    }
}
