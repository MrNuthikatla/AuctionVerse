package com.example.eBaazee.service;

import com.example.eBaazee.entities.Bid;
import com.example.eBaazee.entities.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    User createUser(User user);

    User getUserById(Long userId);

    Optional<User> getUserByUsername(String username);

    Optional<User> getUserByEmail(String email);

    User updateUser(Long userId, String username, String email, String passwordHash, User.Role role);

    List<User> getAllUsers();

    void deleteUser(Long userId);

    boolean authenticateUser(String username, String passwordHash);

    boolean isUsernameAvailable(String username);

    boolean isEmailAvailable(String email);

    boolean isPasswordStrong(String password);

    boolean isEmailValid(String email);

    boolean isUsernameValid(String username);

    boolean isPasswordValid(String password);

    boolean isUserRegistered(String email);

    boolean isUserLoggedIn(String username);

    boolean isUserAdmin(String username);

    boolean isUserSeller(String username);

    boolean isUserBuyer(String username);

    boolean isUserBanned(String username);

    boolean isUserDeactivated(String username);

    boolean isUserActivated(String username);

    boolean isUserBlocked(String username);

    boolean isUserUnblocked(String username);

    boolean isUserSuspended(String username);

    boolean isUserUnsuspended(String username);

    boolean isUserVerified(String username);

    List<Bid> getBidsByUser(Long userId);
}
