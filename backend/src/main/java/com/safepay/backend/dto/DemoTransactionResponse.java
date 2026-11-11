
package com.safepay.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record DemoTransactionResponse(
        String referenceId,
        String status,
        String mode,
        String fraudCheck,
        String message,
        int riskScore,
        String riskLevel,
        List<String> riskReasons,
        String decision,
        TransactionDetails transaction
) {

    public record TransactionDetails(
            String senderUpiId,
            String receiverUpiId,
            BigDecimal amount,
            String currency,
            String city,
            OffsetDateTime transactionTime,
            OffsetDateTime receivedAt
    ) {
    }
}
