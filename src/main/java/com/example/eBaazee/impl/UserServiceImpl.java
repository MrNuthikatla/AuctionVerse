package com.example.eBaazee.impl;

import com.example.eBaazee.entities.*;
import com.example.eBaazee.repository.*;
import com.example.eBaazee.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BidRepository bidRepo;

    @Autowired
    private ProductRepository productRepo;

    @Override
    public User createUser(User user) {
        return userRepo.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

  @Override
  public Optional<User> getUserByUsername(String username) {
      return userRepo.findByUsername(username);
  }

  @Override
  public Optional<User> getUserByEmail(String email) {
    return userRepo.findByEmail(email);
  }

  @Override
  public User updateUser(Long userId, String username, String email, String passwordHash, User.Role role) {
    if(null == userId){
      new RuntimeException("usedId is null");
    }
    User user = getUserById(userId);
    if(!(username.isEmpty() || username.isBlank())){
      user.setUsername(username);
    }
    if(!(email.isEmpty() || email.isBlank())){
      user.setEmail(email);
    }
    if(!(passwordHash.isEmpty() || passwordHash.isBlank())){
      user.setPasswordHash(passwordHash);
    }
    if(role != user.getRole()){
      user.setRole(role);
    }

    return userRepo.save(user);
  }

  @Override
  public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

  @Override
  public boolean authenticateUser(String username, String passwordHash) {
    return false;
  }

  @Override
  public boolean isUsernameAvailable(String username) {
    return false;
  }

  @Override
  public boolean isEmailAvailable(String email) {
    return false;
  }

  @Override
  public boolean isPasswordStrong(String password) {
    return false;
  }

  @Override
  public boolean isEmailValid(String email) {
    return false;
  }

  @Override
  public boolean isUsernameValid(String username) {
    return false;
  }

  @Override
  public boolean isPasswordValid(String password) {
    return false;
  }

  @Override
  public boolean isUserRegistered(String email) {
    return false;
  }

  @Override
  public boolean isUserLoggedIn(String username) {
    return false;
  }

  @Override
  public boolean isUserAdmin(String username) {
    Optional<User> user = getUserByUsername(username);
    if(user.isPresent()){
      return user.get().getRole() == User.Role.ADMIN;
    }
    return false;
  }

  @Override
  public boolean isUserSeller(String username) {
    Optional<User> user = getUserByUsername(username);
    if(user.isPresent()){
      return user.get().getRole() == User.Role.SELLER;
    }
    return false;
  }

  @Override
  public boolean isUserBuyer(String username) {
    Optional<User> user = getUserByUsername(username);
    if(user.isPresent()){
      return user.get().getRole() == User.Role.BUYER;
    }
    return false;
  }

  @Override
  public boolean isUserBanned(String username) {
    return false;
  }

  @Override
  public boolean isUserDeactivated(String username) {
    return false;
  }

  @Override
  public boolean isUserActivated(String username) {
    return false;
  }

  @Override
  public boolean isUserBlocked(String username) {
    return false;
  }

  @Override
  public boolean isUserUnblocked(String username) {
    return false;
  }

  @Override
  public boolean isUserSuspended(String username) {
    return false;
  }

  @Override
  public boolean isUserUnsuspended(String username) {
    return false;
  }

  @Override
  public boolean isUserVerified(String username) {
    return false;
  }

  @Override
  public List<Bid> getBidsByUser(Long userId) {
    List<Bid> userBids = new ArrayList<>();
    User user = getUserById(userId);
        List<Bid> bids = bidRepo.findAll();
        for(Bid bid:  bids){
          if(user.equals(bid.getBidder())){
            userBids.add(bid);
          }
        }
        return userBids;
    }

}
