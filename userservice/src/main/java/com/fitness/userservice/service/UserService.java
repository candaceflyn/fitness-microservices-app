package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.exception.ResourceNotFoundException;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ResourceNotFoundException("User not found"));
        return getUserResponse(user);
    }

    @NonNull
    private UserResponse getUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setKeycloakId(user.getKeycloakId());
        userResponse.setEmail(user.getEmail());
        userResponse.setPassword(user.getPassword());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());

        return userResponse;
    }

    public UserResponse register(@Valid RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            User existingUser = userRepository.findByEmail(request.getEmail());
            log.warn(
                    "[USER-SERVICE][REGISTER] Email exists but keycloakId differs | email={} | existingKeycloakId={}",
                    request.getEmail(),
                    existingUser.getKeycloakId()
            );

            // SYNC KEYCLOAK ID
            if (!request.getKeycloakId().equals(existingUser.getKeycloakId())) {
                log.warn(
                        "[USER-SERVICE][SYNC] Updating keycloakId | email={} | old={} | new={}",
                        existingUser.getEmail(),
                        existingUser.getKeycloakId(),
                        request.getKeycloakId()
                );
                existingUser.setKeycloakId(request.getKeycloakId());
                userRepository.save(existingUser);
            }

            return getUserResponse(existingUser);
        }

        User user = new User();
        user.setKeycloakId(request.getKeycloakId());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = userRepository.save(user);
        return getUserResponse(savedUser);
    }

    public Boolean existsByUserId(String userId) {
        log.info(
                "[USER-SERVICE][VALIDATE] Checking existence by keycloakId={}",
                userId
        );
        return userRepository.existsByKeycloakId(userId);
    }
}
