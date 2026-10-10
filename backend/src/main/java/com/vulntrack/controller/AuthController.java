package com.vulntrack.controller;

import com.vulntrack.dto.AuthResponseDTO;
import com.vulntrack.dto.LoginRequestDTO;
import com.vulntrack.dto.RegisterRequestDTO;

import com.vulntrack.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService =
                authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid
            @RequestBody
            RegisterRequestDTO request) {

        String message =
                authService.register(
                        request
                );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        message
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO>
    login(
            @Valid
            @RequestBody
            LoginRequestDTO request) {

        return ResponseEntity.ok(
                authService.login(
                        request
                )
        );
    }
}