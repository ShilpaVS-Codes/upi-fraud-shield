
package com.safepay.backend.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.safepay.backend.repository.DemoTransactionRepository;

@Service
public class FraudDetectionService {

    private static final BigDecimal HIGH_AMOUNT =
            new BigDecimal("10000.00");

    private final DemoTransactionRepository transactionRepository;

    public FraudDetectionService(
            DemoTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public FraudAnalysis analyze(
            String senderUpiId,
            BigDecimal amount,
            String city,
            OffsetDateTime receivedAt) {

        int score = 0;
        List<String> reasons = new ArrayList<>();

        // Rule 1: High transaction amount
        if (amount.compareTo(HIGH_AMOUNT) > 0) {
            score += 30;
            reasons.add("Transaction amount exceeds Rs. 10,000");
        }

        // Rule 2: Five or more transactions in ten minutes
        OffsetDateTime tenMinutesAgo = receivedAt.minusMinutes(10);

        long recentTransactions =
                transactionRepository
                        .countBySenderUpiIdIgnoreCaseAndReceivedAtAfter(
                                senderUpiId, tenMinutesAgo);

        if (recentTransactions >= 5) {
            score += 40;
            reasons.add("Five or more transactions within 10 minutes");
        }

        // Rule 3: New city compared with sender history
        boolean senderHasHistory =
                transactionRepository
                        .existsBySenderUpiIdIgnoreCase(senderUpiId);

        if (senderHasHistory) {
            boolean cityPreviouslyUsed =
                    transactionRepository
                            .existsBySenderUpiIdIgnoreCaseAndCityIgnoreCase(
                                    senderUpiId, city);

            if (!cityPreviouslyUsed) {
                score += 30;
                reasons.add("Transaction from a previously unused city");
            }
        }

        // Maximum risk score is 100
        score = Math.min(score, 100);

        String riskLevel;
        String decision;

        if (score < 30) {
            riskLevel = "LOW";
            decision = "APPROVED";
        } else if (score < 60) {
            riskLevel = "MEDIUM";
            decision = "REVIEW";
        } else {
            riskLevel = "HIGH";
            decision = "BLOCKED";
        }

        return new FraudAnalysis(
                score, riskLevel, reasons, decision);
    }

    public record FraudAnalysis(
            int riskScore,
            String riskLevel,
            List<String> riskReasons,
            String decision) {
    }
}
