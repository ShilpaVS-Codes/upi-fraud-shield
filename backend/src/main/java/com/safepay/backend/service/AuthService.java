
package com.safepay.backend.service;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.safepay.backend.dto.LoginRequest;
import com.safepay.backend.dto.RegisterRequest;
import com.safepay.backend.entity.DemoUser;
import com.safepay.backend.repository.DemoUserRepository;
@Service
public class AuthService {

    private final DemoUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            DemoUserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public DemoUser register(RegisterRequest request) {

        if (userRepository.existsByMobile(request.mobile())) {
            throw new IllegalArgumentException(
                "This mobile number is already registered"
            );
        }

        DemoUser user = new DemoUser();

        user.setFullName(request.fullName().trim());
        user.setMobile(request.mobile());
        user.setEmail(
            request.email() == null || request.email().isBlank()
                ? null
                : request.email().trim()
        );
        user.setCity(request.city().trim());

        String upiId;
        do {
            upiId = "user"
                + UUID.randomUUID().toString()
                    .replace("-", "")
                    .substring(0, 12)
                    .toLowerCase(Locale.ROOT)
                + "@safepay";
        } while (userRepository.existsByUpiIdIgnoreCase(upiId));

        user.setUpiId(upiId);

        // Never store the original PIN.
        user.setPinHash(passwordEncoder.encode(request.pin()));

        OffsetDateTime now = OffsetDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        return userRepository.save(user);
    }

    public DemoUser login(LoginRequest request) {

        DemoUser user = userRepository.findByMobile(request.mobile())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid mobile number or PIN"
                ));

        boolean pinMatches = passwordEncoder.matches(
                request.pin(),
                user.getPinHash()
        );

        if (!pinMatches) {
            throw new IllegalArgumentException(
                    "Invalid mobile number or PIN"
            );
        }

        return user;
    }

    @Transactional(readOnly = true)
    public DemoUser findByMobile(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User account not found"
                ));
    }


}
