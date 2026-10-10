
package com.vulntrack.service;

import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vulntrack.dto.AuthResponseDTO;
import com.vulntrack.dto.LoginRequestDTO;
import com.vulntrack.dto.RegisterRequestDTO;
import com.vulntrack.entity.Role;
import com.vulntrack.entity.User;
import com.vulntrack.repository.UserRepository;
import com.vulntrack.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserDetailsService userDetailsService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public String register(RegisterRequestDTO request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Registration details are required."
            );
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        // Public registration only permits Analyst and Developer.
        if (request.getRole() != Role.ANALYST
                && request.getRole() != Role.DEVELOPER) {

            throw new IllegalArgumentException(
                    "Only Analyst and Developer accounts can be registered."
            );
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(request.getRole());

        user.setDepartment(
                request.getDepartment() == null
                        ? null
                        : request.getDepartment().trim()
        );

        userRepository.save(user);

        return "Registration successful";
    }

    public AuthResponseDTO login(LoginRequestDTO request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow();

        UserDetails userDetails = userDetailsService
                .loadUserByUsername(user.getEmail());

        String token = jwtService.generateToken(userDetails);

        return new AuthResponseDTO(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );
    }
}
