
package com.safepay.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.safepay.backend.dto.DemoTransactionRequest;
import com.safepay.backend.dto.DemoTransactionResponse;
import com.safepay.backend.service.DemoTransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/demo")
public class DemoTransactionController {

    private final DemoTransactionService service;

    public DemoTransactionController(DemoTransactionService service) {
        this.service = service;
    }

    @PostMapping("/transactions")
    public DemoTransactionResponse submitDemoTransaction(
            @Valid @RequestBody DemoTransactionRequest request) {
        return service.process(request);
    }
}
