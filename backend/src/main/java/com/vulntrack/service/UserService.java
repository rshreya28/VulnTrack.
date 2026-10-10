package com.vulntrack.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vulntrack.dto.UserDTO;
import com.vulntrack.entity.Role;
import com.vulntrack.entity.User;
import com.vulntrack.entity.Vulnerability;
import com.vulntrack.entity.VulnerabilityStatus;
import com.vulntrack.exception.ResourceNotFoundException;
import com.vulntrack.repository.RemediationRepository;
import com.vulntrack.repository.UserRepository;
import com.vulntrack.repository.VulnerabilityRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final VulnerabilityRepository
            vulnerabilityRepository;

    private final RemediationRepository
            remediationRepository;

    public UserService(
            UserRepository userRepository,
            VulnerabilityRepository vulnerabilityRepository,
            RemediationRepository remediationRepository) {

        this.userRepository =
                userRepository;

        this.vulnerabilityRepository =
                vulnerabilityRepository;

        this.remediationRepository =
                remediationRepository;
    }

    public List<UserDTO> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<UserDTO> getDevelopers() {

        return userRepository
                .findByRole(Role.DEVELOPER)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional
    public void deleteUser(Long id) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "User not found"
                                        )
                        );

        /*
         * Never allow the system administrator
         * account to be deleted.
         */
        if (user.getRole() == Role.ADMIN) {

            throw new RuntimeException(
                    "Admin account cannot be deleted."
            );
        }

        /*
         * Analysts who already reported vulnerabilities
         * should remain in the database because the
         * reportedBy relationship is part of the
         * vulnerability audit history.
         */
        if (user.getRole() == Role.ANALYST) {

            boolean hasReports =
                    vulnerabilityRepository
                            .existsByReportedBy(user);

            if (hasReports) {

                throw new RuntimeException(
                        "This analyst cannot be deleted because they have reported vulnerabilities. Their account is required to preserve vulnerability history."
                );
            }
        }

        /*
         * Developers may have vulnerabilities currently
         * assigned to them.
         *
         * Before deleting the developer, remove those
         * assignments.
         */
        if (user.getRole() == Role.DEVELOPER) {

            /*
             * If remediation records already exist,
             * preserve the developer because those
             * records form part of the audit history.
             */
            boolean hasRemediationHistory =
                    remediationRepository
                            .existsByDeveloper(user);

            if (hasRemediationHistory) {

                throw new RuntimeException(
                        "This developer cannot be deleted because remediation history exists for this account."
                );
            }

            List<Vulnerability>
                    assignedVulnerabilities =
                    vulnerabilityRepository
                            .findByAssignedTo(user);

            for (
                    Vulnerability vulnerability :
                    assignedVulnerabilities
            ) {

                /*
                 * Remove developer assignment.
                 */
                vulnerability.setAssignedTo(null);

                /*
                 * If the issue was simply assigned,
                 * return it to OPEN so Admin can
                 * assign another developer.
                 */
                if (
                        vulnerability.getStatus()
                                == VulnerabilityStatus.ASSIGNED
                ) {

                    vulnerability.setStatus(
                            VulnerabilityStatus.OPEN
                    );
                }

                /*
                 * REOPENED vulnerabilities also need
                 * another developer after this user
                 * is removed.
                 */
                if (
                        vulnerability.getStatus()
                                == VulnerabilityStatus.REOPENED
                ) {

                    vulnerability.setStatus(
                            VulnerabilityStatus.OPEN
                    );
                }

                vulnerabilityRepository.save(
                        vulnerability
                );
            }
        }

        userRepository.delete(user);
    }

    private UserDTO convertToDTO(
            User user) {

        UserDTO dto =
                new UserDTO();

        dto.setId(
                user.getId()
        );

        dto.setName(
                user.getName()
        );

        dto.setEmail(
                user.getEmail()
        );

        dto.setRole(
                user.getRole()
        );

        dto.setDepartment(
                user.getDepartment()
        );

        return dto;
    }
}