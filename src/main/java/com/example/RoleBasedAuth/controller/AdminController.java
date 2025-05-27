package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.model.Role;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;

    // Create new user
    @PostMapping("/users/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User userRequest) {
        // Optional: validate user data here (e.g., username unique)

        if (userRepository.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // You might want to encode password here if you don't do it elsewhere
        // userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        // Set default role if not set
        if (userRequest.getRole() == null) {
            userRequest.setRole(Role.BUYER);  // or throw error or require role explicitly
        }

        User savedUser = userRepository.save(userRequest);
        return ResponseEntity.ok(savedUser);
    }

    // List all users
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}
