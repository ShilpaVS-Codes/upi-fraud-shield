
package com.safepay.backend.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "demo_transactions")
public class DemoTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_id", nullable = false, unique = true, length = 13)
    private String referenceId;

    @Column(name = "sender_upi_id", nullable = false, length = 64)
    private String senderUpiId;

    @Column(name = "receiver_upi_id", nullable = false, length = 64)
    private String receiverUpiId;

    @Column(nullable = false, precision = 9, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency = "INR";

    @Column(nullable = false, length = 60)
    private String city;

    @Column(name = "transaction_time", nullable = false)
    private OffsetDateTime transactionTime;

    @Column(name = "received_at", nullable = false)
    private OffsetDateTime receivedAt;

    @Column(nullable = false, length = 20)
    private String status = "VALIDATED";

    @Column(nullable = false, length = 10)
    private String mode = "demo";

    @Column(name = "fraud_check", nullable = false, length = 30)
    private String fraudCheck = "NOT_PERFORMED";

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore = 0;

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel = "LOW";

    @Column(name = "risk_reasons", nullable = false, columnDefinition = "TEXT")
    private String riskReasons = "";

    @Column(nullable = false, length = 20)
    private String decision = "APPROVED";

    public DemoTransaction() {
    }

    public Long getId() {
        return id;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getSenderUpiId() {
        return senderUpiId;
    }

    public void setSenderUpiId(String senderUpiId) {
        this.senderUpiId = senderUpiId;
    }

    public String getReceiverUpiId() {
        return receiverUpiId;
    }

    public void setReceiverUpiId(String receiverUpiId) {
        this.receiverUpiId = receiverUpiId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public OffsetDateTime getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(OffsetDateTime transactionTime) {
        this.transactionTime = transactionTime;
    }

    public OffsetDateTime getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(OffsetDateTime receivedAt) {
        this.receivedAt = receivedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getFraudCheck() {
        return fraudCheck;
    }

    public void setFraudCheck(String fraudCheck) {
        this.fraudCheck = fraudCheck;
    }
        public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getRiskReasons() {
        return riskReasons;
    }

    public void setRiskReasons(String riskReasons) {
        this.riskReasons = riskReasons;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }
    }
