
package com.safepay.backend.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safepay.backend.entity.DemoTransaction;

public interface DemoTransactionRepository
        extends JpaRepository<DemoTransaction, Long> {

    long countBySenderUpiIdIgnoreCaseAndReceivedAtAfter(
            String senderUpiId,
            OffsetDateTime since);

    boolean existsBySenderUpiIdIgnoreCaseAndCityIgnoreCase(
            String senderUpiId,
            String city);

    List<DemoTransaction> findTop5BySenderUpiIdIgnoreCaseOrderByReceivedAtDesc(
            String senderUpiId);

            boolean existsBySenderUpiIdIgnoreCase(String senderUpiId);

     List<DemoTransaction> findBySenderUpiIdIgnoreCaseOrderByReceivedAtDesc(
            String senderUpiId);
}
