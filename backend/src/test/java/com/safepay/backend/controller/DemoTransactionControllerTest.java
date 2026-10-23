package com.safepay.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests for POST /api/demo/transactions.
 * MockMvc calls the controller directly, so the server does not need to be running.
 */
@SpringBootTest
@AutoConfigureMockMvc
class DemoTransactionControllerTest {

    private static final String SENDER = "arjun@safepay";
    private static final String RECEIVER = "priya@upi";
    private static final String CITY = "New Delhi";

    @Autowired
    private MockMvc mockMvc;

    // ---------- Helpers ----------

    // Sends a JSON body to the demo transaction endpoint
    private ResultActions postTransaction(String json) throws Exception {
        return mockMvc.perform(post("/api/demo/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json));
    }

    // Builds a request body. "amount" is inserted as a raw JSON number (no quotes).
    private static String requestJson(String sender, String receiver, String amount, String city) {
        return """
                {"senderUpiId":"%s","receiverUpiId":"%s","amount":%s,"city":"%s"}
                """.formatted(sender, receiver, amount, city);
    }

    // Checks the standard error format when exactly ONE field is wrong
    private static void assertSingleValidationError(ResultActions result, String field, String message)
            throws Exception {
        result.andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.fieldErrors.length()").value(1))
                .andExpect(jsonPath("$.fieldErrors[0].field").value(field))
                .andExpect(jsonPath("$.fieldErrors[0].message").value(message));
    }

    // Checks the error format used for unreadable request bodies
    private static void assertMalformedRequest(ResultActions result) throws Exception {
        result.andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("MALFORMED_REQUEST"))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.fieldErrors.length()").value(0));
    }

    // ---------- Valid requests ----------

    @Test
    void validRequestIsAccepted() throws Exception {
        String body = """
                {
                  "senderUpiId": "arjun@safepay",
                  "receiverUpiId": "priya@upi",
                  "amount": 2500,
                  "city": "New Delhi",
                  "transactionTime": "2025-01-15T10:30:00+05:30"
                }
                """;

        postTransaction(body)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VALIDATED"))
                .andExpect(jsonPath("$.mode").value("demo"))
                .andExpect(jsonPath("$.fraudCheck").value("NOT_PERFORMED"))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.referenceId").exists())
                .andExpect(jsonPath("$.transaction.senderUpiId").value("arjun@safepay"))
                .andExpect(jsonPath("$.transaction.receiverUpiId").value("priya@upi"))
                .andExpect(jsonPath("$.transaction.amount").value(2500.0))
                .andExpect(jsonPath("$.transaction.currency").value("INR"))
                .andExpect(jsonPath("$.transaction.city").value("New Delhi"))
                .andExpect(jsonPath("$.transaction.transactionTime").exists())
                .andExpect(jsonPath("$.transaction.receivedAt").exists());
    }

    @Test
    void validRequestWithoutTransactionTimeIsAccepted() throws Exception {
        // transactionTime is optional: the server fills in the current time
        postTransaction(requestJson(SENDER, RECEIVER, "100", CITY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VALIDATED"))
                .andExpect(jsonPath("$.transaction.transactionTime").exists());
    }

    @Test
    void amountsAtTheLowerAndUpperLimitAreAccepted() throws Exception {
        postTransaction(requestJson(SENDER, RECEIVER, "1.00", CITY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VALIDATED"));

        postTransaction(requestJson(SENDER, RECEIVER, "100000.00", CITY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VALIDATED"));
    }

    // ---------- UPI ID validation ----------

    @Test
    void invalidSenderUpiIdIsRejected() throws Exception {
        assertSingleValidationError(
                postTransaction(requestJson("arjun", RECEIVER, "100", CITY)),
                "senderUpiId", "senderUpiId must look like name@handle");
    }

    @Test
    void invalidReceiverUpiIdIsRejected() throws Exception {
        assertSingleValidationError(
                postTransaction(requestJson(SENDER, "priya@", "100", CITY)),
                "receiverUpiId", "receiverUpiId must look like name@handle");
    }

    // ---------- Amount validation ----------

    @Test
    void amountBelowOneRupeeIsRejected() throws Exception {
        assertSingleValidationError(
                postTransaction(requestJson(SENDER, RECEIVER, "0.5", CITY)),
                "amount", "amount must be at least 1.00");
    }

    @Test
    void amountAboveTheLimitIsRejected() throws Exception {
        assertSingleValidationError(
                postTransaction(requestJson(SENDER, RECEIVER, "100000.01", CITY)),
                "amount", "amount must not exceed 100000.00");

        // A very large amount must give only the "exceed" message, not a decimal-places message
        assertSingleValidationError(
                postTransaction(requestJson(SENDER, RECEIVER, "1234567", CITY)),
                "amount", "amount must not exceed 100000.00");
    }

    @Test
    void amountWithMoreThanTwoDecimalPlacesIsRejected() throws Exception {
        assertSingleValidationError(
                postTransaction(requestJson(SENDER, RECEIVER, "10.123", CITY)),
                "amount", "amount must have at most 2 decimal places");
    }

    // ---------- City validation ----------

    @Test
    void missingCityIsRejected() throws Exception {
        String body = """
                {"senderUpiId":"arjun@safepay","receiverUpiId":"priya@upi","amount":100}
                """;

        assertSingleValidationError(postTransaction(body), "city", "city is required");
    }

    @Test
    void cityWithInvalidCharactersIsRejected() throws Exception {
        assertSingleValidationError(
                postTransaction(requestJson(SENDER, RECEIVER, "100", "Delhi123")),
                "city", "city may contain only letters, spaces, commas, periods and hyphens");
    }

    // ---------- Business rule ----------

    @Test
    void sameSenderAndReceiverIgnoringCaseIsRejected() throws Exception {
        assertSingleValidationError(
                postTransaction(requestJson("arjun@safepay", "ARJUN@safepay", "100", CITY)),
                "receiverUpiId", "receiverUpiId must be different from senderUpiId");
    }

    // ---------- Timestamp ----------

    @Test
    void futureTransactionTimeIsRejected() throws Exception {
        String body = """
                {
                  "senderUpiId": "arjun@safepay",
                  "receiverUpiId": "priya@upi",
                  "amount": 100,
                  "city": "Delhi",
                  "transactionTime": "2099-01-01T10:00:00+05:30"
                }
                """;

        assertSingleValidationError(
                postTransaction(body),
                "transactionTime", "transactionTime must not be in the future");
    }

    // ---------- Unreadable bodies ----------

    @Test
    void malformedJsonIsRejected() throws Exception {
        assertMalformedRequest(postTransaction("{ \"senderUpiId\": \"arjun@safepay\", "));
    }

    @Test
    void wrongDataTypeIsRejected() throws Exception {
        String body = """
                {"senderUpiId":"arjun@safepay","receiverUpiId":"priya@upi","amount":"abc","city":"Delhi"}
                """;

        assertMalformedRequest(postTransaction(body));
    }

    @Test
    void unknownPinFieldIsRejected() throws Exception {
        // The API has no PIN field at all, so a request that sends one must be refused
        String body = """
                {"senderUpiId":"arjun@safepay","receiverUpiId":"priya@upi","amount":100,"city":"Delhi","pin":"123456"}
                """;

        assertMalformedRequest(postTransaction(body));
    }

    // ---------- Error structure with several problems ----------

    @Test
    void severalInvalidFieldsAreListedInAlphabeticalOrder() throws Exception {
        // city is missing, amount is too small, receiverUpiId has no @
        String body = """
                {"senderUpiId":"arjun@safepay","receiverUpiId":"priya","amount":0.5}
                """;

        postTransaction(body)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors.length()").value(3))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("amount"))
                .andExpect(jsonPath("$.fieldErrors[0].message").value("amount must be at least 1.00"))
                .andExpect(jsonPath("$.fieldErrors[1].field").value("city"))
                .andExpect(jsonPath("$.fieldErrors[1].message").value("city is required"))
                .andExpect(jsonPath("$.fieldErrors[2].field").value("receiverUpiId"))
                .andExpect(jsonPath("$.fieldErrors[2].message")
                        .value("receiverUpiId must look like name@handle"));
    }
}