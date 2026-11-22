
package com.safepay.backend.service;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.safepay.backend.dto.LoginRequest;
import com.safepay.backend.dto.RegisterRequest;
import com.safepay.backend.entity.DemoUser;
import com.safepay.backend.repository.DemoUserRepository;
@Service
public class AuthService {

    private final DemoUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FingerprintReader fingerprintReader;
    private final boolean fingerprintEnabled;

    public AuthService(
            DemoUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            FingerprintReader fingerprintReader,
            @Value("${safepay.fingerprint.enabled:false}") boolean fingerprintEnabled) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fingerprintReader = fingerprintReader;
        this.fingerprintEnabled = fingerprintEnabled;
    }

    @Transactional
    public DemoUser register(RegisterRequest request) {
        return registerAccount(request, false);
    }

    @Transactional
    public DemoUser registerWithFingerprint(RegisterRequest request) {
        requireFingerprintEnabled();
        return registerAccount(request, true);
    }

    private DemoUser registerAccount(RegisterRequest request, boolean enrollFingerprint) {

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

        if (enrollFingerprint) {
            user.setFingerprintSlot(enrollFingerprint());
        }

        return userRepository.save(user);
    }

        private int enrollFingerprint() {
        try {
            // The first two slots already hold the demo test fingerprints.
            synchronized (fingerprintReader) {
                for (int slot = 3; slot <= 127; slot++) {
                    if (fingerprintReader.enroll(slot)) {
                        return slot;
                    }
                }
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "Fingerprint enrollment interrupted");
        } catch (IOException ex) {
            org.slf4j.LoggerFactory.getLogger(AuthService.class)
                    .warn("Fingerprint reader failed during enrollment", ex);
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "Fingerprint enrollment failed", ex);
        }

        throw new ResponseStatusException(
                HttpStatus.CONFLICT, "No free fingerprint slot in the demo range");
    }

    public DemoUser loginWithFingerprint(String mobile) {
        requireFingerprintEnabled();
        DemoUser user = userRepository.findByMobile(mobile).orElse(null);

        try {
            var matchedSlot = fingerprintReader.match();
            if (matchedSlot.isPresent()
                    && user != null
                    && user.getFingerprintSlot() != null
                    && matchedSlot.getAsInt() == user.getFingerprintSlot()) {
                return user;
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "Fingerprint scan interrupted");
        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "Fingerprint reader unavailable", ex);
        }

        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Fingerprint did not match this account");
    }

    private void requireFingerprintEnabled() {
        if (!fingerprintEnabled) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, "Fingerprint authentication is disabled");
        }
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
