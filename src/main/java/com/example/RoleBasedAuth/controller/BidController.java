package com.example.RoleBasedAuth.controller;


import com.example.RoleBasedAuth.dto.BidStatusDTO;
import com.example.RoleBasedAuth.model.Bid;
import com.example.RoleBasedAuth.model.Product;
import com.example.RoleBasedAuth.model.Role;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.BidRepository;
import com.example.RoleBasedAuth.repository.ProductRepository;
import com.example.RoleBasedAuth.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "http://localhost:5173")
public class BidController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    @PostMapping("/place/{productId}")
    public ResponseEntity<?> placeBid(
            @PathVariable Integer productId,
            @RequestParam Integer bidAmount,
            @AuthenticationPrincipal User user
    ) {
        // Only BUYERs can bid
        if (user.getRole() != Role.BUYER) {
            return ResponseEntity.badRequest().body("Only BUYERs can place bids.");
        }

        // Find product
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found.");
        }

        // Check if bidding is closed
        if (product.isFrozen() || product.getEndTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Bidding is closed for this product.");
        }

        // Check if buyer already placed a bid
        if (bidRepository.existsByBidderAndProduct(user, product)) {
            return ResponseEntity.badRequest().body("You have already placed a bid on this product.");
        }

        // Validate bid range
        if (bidAmount < product.getMinBid()) {
            return ResponseEntity.badRequest().body("Bid amount must be >= minimum bid.");
        }

        if (bidAmount > product.getMaxBid()) {
            return ResponseEntity.badRequest().body("Bid must be less than or equal max bid.");
        }

        // Check if bid is higher than current max bid
        if (bidAmount <= product.getCurrentBid()) {
            return ResponseEntity.badRequest().body("Bid amount must be higher than the current bid.");
        }

        // Save bid
        Bid bid = Bid.builder()
                .product(product)
                .bidder(user)
                .amount(bidAmount)
                .bidTime(LocalDateTime.now())
                .build();

        bidRepository.save(bid);

        // Update product current bid
        product.setCurrentBid(Double.valueOf(bidAmount));
        productRepository.save(product);

        return ResponseEntity.ok("Bid placed successfully.");
    }

    @GetMapping("/status/{productId}")
    public ResponseEntity<?> getBidStatus(
            @PathVariable Integer productId,
            @AuthenticationPrincipal User user
    ) {
        Product product = productRepository.findById(productId).orElse(null);

        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found.");
        }

        long totalBidders = bidRepository.countByProduct(product);
        Double avgBid = bidRepository.findAverageBidAmountByProduct(product);
        Optional<Bid> maxBidOpt = bidRepository.findTopByProductOrderByAmountDesc(product);

        double maxBidAmount = maxBidOpt.map(Bid::getAmount).orElse(0);
        double avgBidAmount = avgBid != null ? avgBid : 0;

        // Check if user placed a bid
        Bid userBid = null;
        if (user != null) {
            userBid = bidRepository.findByBidderAndProduct(user, product).orElse(null);
        }

        BidStatusDTO status = new BidStatusDTO();
        status.setProductId(product.getId());
        status.setProductName(product.getName());
        status.setTotalBidders(totalBidders);
        status.setAverageBidAmount(avgBidAmount);
        status.setMaxBidAmount(maxBidAmount);

        if (userBid != null) {
            status.setUserBidAmount(userBid.getAmount());
            status.setHasUserBid(true);
        } else {
            status.setHasUserBid(false);
        }

        return ResponseEntity.ok(status);
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> checkIfBidExists(
        @PathVariable Integer productId,
        @AuthenticationPrincipal User user
    ) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Product not found."));
        }
        boolean alreadyBid = bidRepository.existsByBidderAndProduct(user, product);
        return ResponseEntity.ok(Map.of("alreadyBid", alreadyBid));
    }
}
