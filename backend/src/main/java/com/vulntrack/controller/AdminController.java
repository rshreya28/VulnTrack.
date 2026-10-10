package com.vulntrack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vulntrack.dto.UserDTO;
import com.vulntrack.dto.VulnerabilityResponseDTO;
import com.vulntrack.service.UserService;
import com.vulntrack.service.VulnerabilityService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    private final VulnerabilityService
            vulnerabilityService;

    public AdminController(
            UserService userService,
            VulnerabilityService vulnerabilityService) {

        this.userService =
                userService;

        this.vulnerabilityService =
                vulnerabilityService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>>
    getUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/developers")
    public ResponseEntity<List<UserDTO>>
    getDevelopers() {

        return ResponseEntity.ok(
                userService.getDevelopers()
        );
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>>
    deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "User deleted successfully"
                )
        );
    }

    @PutMapping(
            "/assign/{vulnerabilityId}/developer/{developerId}"
    )
    public ResponseEntity<VulnerabilityResponseDTO>
    assignVulnerability(
            @PathVariable Long vulnerabilityId,
            @PathVariable Long developerId) {

        VulnerabilityResponseDTO response =
                vulnerabilityService
                        .assign(
                                vulnerabilityId,
                                developerId
                        );

        return ResponseEntity.ok(
                response
        );
    }
}