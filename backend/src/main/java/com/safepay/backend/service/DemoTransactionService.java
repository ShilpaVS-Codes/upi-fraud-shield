
package com.safepay.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.safepay.backend.dto.DemoTransactionRequest;
import com.safepay.backend.dto.DemoTransactionResponse;
import com.safepay.backend.exception.InvalidTransactionException;

@Service
public class DemoTransactionService {

    public DemoTransactionResponse process(DemoTransactionRequest request) {

        if (request.senderUpiId().equalsIgnoreCase(request.receiverUpiId())) {
            throw new InvalidTransactionException(
                    "receiverUpiId",
                    "receiverUpiId must be different from senderUpiId");
        }

        OffsetDateTime receivedAt = OffsetDateTime.now(ZoneOffset.UTC);

        OffsetDateTime transactionTime =
                request.transactionTime() != null
                        ? request.transactionTime()
                        : receivedAt;

        BigDecimal amount =
                request.amount().setScale(2, RoundingMode.UNNECESSARY);

        String referenceId = "DEMO-" + UUID.randomUUID()
                .toString().substring(0, 8).toUpperCase(Locale.ROOT);

        DemoTransactionResponse.TransactionDetails details =
                new DemoTransactionResponse.TransactionDetails(
                        request.senderUpiId(),
                        request.receiverUpiId(),
                        amount,
                        "INR",
                        request.city(),
                        transactionTime,
                        receivedAt);

        return new DemoTransactionResponse(
                referenceId,
                "VALIDATED",
                "demo",
                "NOT_PERFORMED",
                "Request is valid. Fraud analysis is not implemented yet. "
                        + "No real UPI network or bank was contacted.",
                details);
    }
}
