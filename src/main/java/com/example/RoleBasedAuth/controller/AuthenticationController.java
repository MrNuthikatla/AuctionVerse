package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.model.AuthenticationResponse;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<AuthenticationResponse> register(
        @RequestBody User request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthenticationResponse> login(
        @RequestBody User request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
