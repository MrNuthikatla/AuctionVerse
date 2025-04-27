package com.fsad.auction_backend.controller;

import com.fsad.auction_backend.model.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        return "User " + user.getUsername() + " registered with role: " + user.getRole();
    }
}