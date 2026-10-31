
package com.safepay.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.safepay.backend.dto.DemoTransactionRequest;
import com.safepay.backend.dto.DemoTransactionResponse;
import com.safepay.backend.entity.DemoTransaction;
import com.safepay.backend.exception.InvalidTransactionException;
import com.safepay.backend.repository.DemoTransactionRepository;

@Service
public class DemoTransactionService {

    private final DemoTransactionRepository transactionRepository;

    public DemoTransactionService(
            DemoTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
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

        DemoTransaction transaction = new DemoTransaction();
        transaction.setReferenceId(referenceId);
        transaction.setSenderUpiId(request.senderUpiId());
        transaction.setReceiverUpiId(request.receiverUpiId());
        transaction.setAmount(amount);
        transaction.setCurrency("INR");
        transaction.setCity(request.city());
        transaction.setTransactionTime(transactionTime);
        transaction.setReceivedAt(receivedAt);
        transaction.setStatus("VALIDATED");
        transaction.setMode("demo");
        transaction.setFraudCheck("NOT_PERFORMED");

        transactionRepository.save(transaction);

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
