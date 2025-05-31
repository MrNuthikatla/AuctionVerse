package com.example.RoleBasedAuth.dto;

import com.example.RoleBasedAuth.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserProfileDTO {
    private String firstName;
    private String lastName;
    private String username;
    private String password;

    public UserProfileDTO(User user) {
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
    }
}
