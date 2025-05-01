package com.example.eBaazee.service;

import com.example.eBaazee.entities.User;

public interface AuthService {
    User register(User user);

    User login(String username, String password);
}
