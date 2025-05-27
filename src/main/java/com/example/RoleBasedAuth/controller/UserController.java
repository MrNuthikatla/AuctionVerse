package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.model.Bid;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.BidRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private BidRepository bidRepository;

    @GetMapping("/my-bids")
    public ResponseEntity<?> getMyBids(@AuthenticationPrincipal User user) {
        List<Bid> myBids = bidRepository.findByBidder(user);
        return ResponseEntity.ok(myBids);
    }
}
