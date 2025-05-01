package com.example.eBaazee.controller;

import com.example.eBaazee.entities.User;
import com.example.eBaazee.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private AuthService authService;

  @PostMapping("/register")
  public User register(@RequestBody User user) {
    return authService.register(user);
  }

  @PostMapping("/login")
  public User login(@RequestParam String username, @RequestParam String password) {
    return authService.login(username, password);
  }
}
