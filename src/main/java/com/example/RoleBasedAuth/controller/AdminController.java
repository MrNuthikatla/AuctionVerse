package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.model.Product;
import com.example.RoleBasedAuth.model.Role;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.ProductRepository;
import com.example.RoleBasedAuth.repository.UserRepository;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // List all products
    @GetMapping("/products")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/products/{id}/state")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> changeProductState(
        @PathVariable Integer id,
        @RequestBody ProductStateChangeRequest request) {
        return productRepository.findById(id)
            .map(product -> {
                if (request.getIsFrozen() != null) {
                    product.setFrozen(request.getIsFrozen());
                }
                if (request.getIsSold() != null) {
                    product.setSold(request.getIsSold());
                }
                productRepository.save(product);
                return ResponseEntity.ok(product);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Create new user
    @PostMapping("/users/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User userRequest) {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRequest.getRole() == null) {
            userRequest.setRole(Role.BUYER);
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

    @Setter
    @Getter
    public static class ProductStateChangeRequest {
        private Boolean isFrozen;
        private Boolean isSold;
    }
}