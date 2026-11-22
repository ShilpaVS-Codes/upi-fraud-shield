
package com.safepay.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors -> {})
            // Temporary until we add CSRF token handling.
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/api/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/health"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/register",
                    "/api/auth/login",
                    "/api/auth/fingerprint/login"
                ).permitAll()

                .requestMatchers(
                    "/api/demo/transactions"
                ).authenticated()

                .anyRequest().authenticated()
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(
                    (request, response, authException) ->
                        response.sendError(
                            HttpStatus.UNAUTHORIZED.value(),
                            "Authentication required"
                        )
                )
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
