
package com.safepay.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.safepay.backend.entity.DemoTransaction;

public record RecentTransactionResponse(
        String referenceId,
        String receiverUpiId,
        BigDecimal amount,
        String currency,
        OffsetDateTime transactionTime,
        String status,
        Integer riskScore,
        String riskLevel,
        String decision
) {

    public static RecentTransactionResponse from(
            DemoTransaction transaction) {

        return new RecentTransactionResponse(
                transaction.getReferenceId(),
                transaction.getReceiverUpiId(),
                transaction.getAmount(),
                transaction.getCurrency(),
                transaction.getTransactionTime(),
                transaction.getStatus(),
                transaction.getRiskScore(),
                transaction.getRiskLevel(),
                transaction.getDecision()
        );
    }
}
