package com.example.eBaazee.controller;

import com.example.eBaazee.entities.User;
import com.example.eBaazee.service.UserService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<List<User>> getUser() {
        return (ResponseEntity<List<User>>) userService.getAllUsers();
    }

    @PostMapping()
    public Optional<User> createUser(@RequestBody User user) {
        return Optional.ofNullable(userService.createUser(user));
    }

}
