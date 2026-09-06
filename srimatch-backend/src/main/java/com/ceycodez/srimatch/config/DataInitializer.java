package com.ceycodez.srimatch.config;

import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.UserRole;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.email:admin@srimatch.lk}")
    private String defaultAdminEmail;

    @Value("${app.default-admin.password:Admin@123}")
    private String defaultAdminPassword;

    @Value("${app.default-admin.first-name:Admin}")
    private String defaultAdminFirstName;

    @Value("${app.default-admin.last-name:SriMatch}")
    private String defaultAdminLastName;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdminUser();
    }

    private void seedAdminUser() {
        String email = (defaultAdminEmail != null && !defaultAdminEmail.isBlank())
                ? defaultAdminEmail.trim()
                : "admin@srimatch.lk";
        String password = (defaultAdminPassword != null && !defaultAdminPassword.isBlank())
                ? defaultAdminPassword.trim()
                : "Admin@123";

        if (!userRepository.existsByEmail(email)) {
            log.info("Creating default initial admin user: {}", email);
            User admin = User.builder()
                    .firstName(defaultAdminFirstName != null && !defaultAdminFirstName.isBlank() ? defaultAdminFirstName : "Admin")
                    .lastName(defaultAdminLastName != null && !defaultAdminLastName.isBlank() ? defaultAdminLastName : "SriMatch")
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(UserRole.SUPER_ADMIN)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .profileCompleted(true)
                    .agreeToTerms(true)
                    .agreeToMarketing(false)
                    .build();

            userRepository.save(admin);
            log.info("Default admin user created successfully: {}", email);
        } else {
            log.debug("Admin user {} already exists. Skipping creation.", email);
        }
    }
}
