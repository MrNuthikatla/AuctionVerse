package com.example.RoleBasedAuth.model;

public class AuthenticationResponse {
    private final String token;
    private final String message;
    private final Role role;  // add role field

    public AuthenticationResponse(String token, String message, Role role) {
        this.token = token;
        this.message = message;
        this.role = role;
    }

    public AuthenticationResponse(String token, String message) {
        this(token, message, null);
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }

    public Role getRole() {
        return role;
    }
}
