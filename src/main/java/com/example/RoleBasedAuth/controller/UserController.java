package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.dto.BidDTO;
import com.example.RoleBasedAuth.dto.UserProfileDTO;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.BidRepository;
import com.example.RoleBasedAuth.repository.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-bids")
    @PreAuthorize("hasAuthority('BUYER')")
    public ResponseEntity<?> getMyBids(@AuthenticationPrincipal User user) {
        List<BidDTO> myBids = bidRepository.findByBidder(user)
            .stream()
            .map(BidDTO::new)
            .toList();

        return ResponseEntity.ok(myBids);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new UserProfileDTO(user));
    }

    @Transactional
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user, @RequestBody UserProfileDTO update) {
        boolean passwordChanged = false;

        if (update.getFirstName() != null) {
            user.setFirstName(update.getFirstName());
        }
        if (update.getLastName() != null) {
            user.setLastName(update.getLastName());
        }
        if (update.getPassword() != null && !update.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(update.getPassword()));
            passwordChanged = true;
        }
        userRepository.save(user);

        if (passwordChanged) {
            // Frontend must log out user on response with this flag
            return ResponseEntity.ok().header("X-Password-Changed", "true").body(new UserProfileDTO(user));
        }

        return ResponseEntity.ok(new UserProfileDTO(user));
    }

}
