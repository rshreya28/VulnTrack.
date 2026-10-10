package com.vulntrack.config;

import com.vulntrack.entity.Role;
import com.vulntrack.entity.User;
import com.vulntrack.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner createDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@vulntrack.com";

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName("VulnTrack Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setDepartment("Security Administration");

                userRepository.save(admin);

                System.out.println(
                    "========== DEFAULT ADMIN CREATED =========="
                );

            } else {

                System.out.println(
                    "========== DEFAULT ADMIN ALREADY EXISTS =========="
                );
            }
        };
    }
}