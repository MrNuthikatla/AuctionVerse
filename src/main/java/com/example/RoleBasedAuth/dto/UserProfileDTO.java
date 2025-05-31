package com.example.RoleBasedAuth.dto;

import com.example.RoleBasedAuth.model.User;

public class UserProfileDTO {
    private String firstName;
    private String lastName;
    private String username;
    
    public UserProfileDTO(User user) {
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUsername() {
        return username;
    }
}
