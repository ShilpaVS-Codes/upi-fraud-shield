package com.safepay.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safepay.backend.entity.DemoTransaction;

public interface DemoTransactionRepository
        extends JpaRepository<DemoTransaction, Long> {
}