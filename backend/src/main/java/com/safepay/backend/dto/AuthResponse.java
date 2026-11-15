
package com.safepay.backend.dto;

import com.safepay.backend.entity.DemoUser;

public record AuthResponse(
    Long id,
    String fullName,
    String mobile,
    String email,
    String city,
    String upiId
) {

    public static AuthResponse from(DemoUser user) {
        return new AuthResponse(
            user.getId(),
            user.getFullName(),
            user.getMobile(),
            user.getEmail(),
            user.getCity(),
            user.getUpiId()
        );
    }
}
