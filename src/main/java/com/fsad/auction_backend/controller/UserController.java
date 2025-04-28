package com.fsad.auction_backend.controller;

import com.fsad.auction_backend.model.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// This is just a outlier need to be developed completely
@RestController
@RequestMapping("/users")
class UserController {

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        if (user.getUsername() == null || user.getPassword() == null || user.getRole() == null) {
            return "All fields are required.";
        }
        return "User " + user.getUsername() + " registered with role: " + user.getRole();
    }

    @GetMapping("/login")
    public String loginUser(@RequestBody User user) {
        if (user.getUsername() == null || user.getPassword() == null) {
            return "Username and password are required.";
        }
        return "User " + user.getUsername() + " logged in successfully.";
    }

    @GetMapping("/logout")
    public String logoutUser() {
        return "User logged out successfully.";
    }
}