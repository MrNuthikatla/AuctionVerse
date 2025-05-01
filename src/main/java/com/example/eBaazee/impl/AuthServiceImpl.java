package com.example.eBaazee.impl;

import com.example.eBaazee.entities.User;
import com.example.eBaazee.repository.UserRepository;
import com.example.eBaazee.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        return userRepository.save(user);
    }

    @Override
    public User login(String username, String password) {
        return userRepository.findByUsername(username)
            .filter(u -> u.getPasswordHash().equals(password))
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}
