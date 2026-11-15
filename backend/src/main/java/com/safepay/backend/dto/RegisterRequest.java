
package com.safepay.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100)
    String fullName,

    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Enter a valid 10-digit Indian mobile number"
    )
    String mobile,

    @Email(message = "Enter a valid email address")
    @Size(max = 255)
    String email,

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 60)
    String city,

    @NotBlank(message = "PIN is required")
    @Pattern(
        regexp = "^[0-9]{6}$",
        message = "PIN must contain exactly 6 digits"
    )
    String pin

) {}
