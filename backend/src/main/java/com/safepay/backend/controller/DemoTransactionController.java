
package com.safepay.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.safepay.backend.dto.DemoTransactionRequest;
import com.safepay.backend.dto.DemoTransactionResponse;
import com.safepay.backend.dto.RecentTransactionResponse;
import com.safepay.backend.entity.DemoUser;
import com.safepay.backend.repository.DemoTransactionRepository;
import com.safepay.backend.repository.DemoUserRepository;
import com.safepay.backend.service.DemoTransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/demo")
public class DemoTransactionController {

    private final DemoTransactionService service;
    private final DemoTransactionRepository transactionRepository;
    private final DemoUserRepository userRepository;

    public DemoTransactionController(
            DemoTransactionService service,
            DemoTransactionRepository transactionRepository,
            DemoUserRepository userRepository) {

        this.service = service;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // Existing Send Money endpoint — unchanged.

    @PostMapping("/transactions")
    public DemoTransactionResponse submitDemoTransaction(
            @Valid @RequestBody DemoTransactionRequest request,
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof
                        org.springframework.security.authentication.AnonymousAuthenticationToken) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first");
        }

        DemoUser loggedInUser = userRepository
                .findByMobile(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Account not found"));

        if (!loggedInUser.getUpiId()
                .equalsIgnoreCase(request.senderUpiId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot send transactions from another user's UPI ID");
        }

        return service.process(request);
    }


    // Latest five transactions for the logged-in user.
    @GetMapping("/transactions/recent")
    public List<RecentTransactionResponse> recentTransactions(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first");
        }

        DemoUser user = userRepository
                .findByMobile(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Account not found"));

        return transactionRepository
                .findTop5BySenderUpiIdIgnoreCaseOrderByReceivedAtDesc(
                        user.getUpiId())
                .stream()
                .map(RecentTransactionResponse::from)
                .toList();
    }

    @GetMapping("/transactions/history")
    public List<RecentTransactionResponse> transactionHistory(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof
                        org.springframework.security.authentication.AnonymousAuthenticationToken) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in first");
        }

        DemoUser user = userRepository
                .findByMobile(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Account not found"));

        return transactionRepository
                .findBySenderUpiIdIgnoreCaseOrderByReceivedAtDesc(
                        user.getUpiId())
                .stream()
                .map(RecentTransactionResponse::from)
                .toList();
    }

}
