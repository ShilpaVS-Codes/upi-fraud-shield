
package com.safepay.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(

    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Enter a valid 10-digit Indian mobile number"
    )
    String mobile,

    @NotBlank(message = "PIN is required")
    @Pattern(
        regexp = "^[0-9]{6}$",
        message = "PIN must contain exactly 6 digits"
    )
    String pin

) {}
