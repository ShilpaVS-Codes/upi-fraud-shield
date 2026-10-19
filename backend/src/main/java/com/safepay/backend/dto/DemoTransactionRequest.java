
package com.safepay.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DemoTransactionRequest(

        @NotBlank(message = "senderUpiId is required")
        @Size(max = 64, message = "senderUpiId must be at most 64 characters")
        @Pattern(regexp = "[a-zA-Z0-9._-]{2,64}@[a-zA-Z]{2,32}",
                 message = "senderUpiId must look like name@handle")
        String senderUpiId,

        @NotBlank(message = "receiverUpiId is required")
        @Size(max = 64, message = "receiverUpiId must be at most 64 characters")
        @Pattern(regexp = "[a-zA-Z0-9._-]{2,64}@[a-zA-Z]{2,32}",
                 message = "receiverUpiId must look like name@handle")
        String receiverUpiId,

        @NotNull(message = "amount is required")
        @DecimalMin(value = "1.00", message = "amount must be at least 1.00")
        @DecimalMax(value = "100000.00", message = "amount must not exceed 100000.00")
        @Digits(integer = 9, fraction = 2,
                message = "amount must have at most 2 decimal places")
        BigDecimal amount,

        @NotBlank(message = "city is required")
        @Size(min = 2, max = 60, message = "city must be between 2 and 60 characters")
        @Pattern(regexp = "[A-Za-z ,.-]+",
                 message = "city may contain only letters, spaces, commas, periods and hyphens")
        String city,

        @PastOrPresent(message = "transactionTime must not be in the future")
        OffsetDateTime transactionTime
) {
}
