
package com.safepay.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safepay.backend.entity.DemoUser;

public interface DemoUserRepository
        extends JpaRepository<DemoUser, Long> {

    Optional<DemoUser> findByMobile(String mobile);

    boolean existsByMobile(String mobile);

    boolean existsByUpiIdIgnoreCase(String upiId);
}
