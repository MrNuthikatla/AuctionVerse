package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.dto.ProductRequestDTO;
import com.example.RoleBasedAuth.model.Bid;
import com.example.RoleBasedAuth.model.Product;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.BidRepository;
import com.example.RoleBasedAuth.repository.ProductRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    @PostMapping("/addproducts")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<?> addProduct(
        @AuthenticationPrincipal User seller,
        @RequestBody ProductRequestDTO productRequest
    ) {
        if (productRequest.getMinBid() > productRequest.getMaxBid()) {
            return ResponseEntity.badRequest().body("minBid cannot be greater than maxBid");
        }

        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setCategory(productRequest.getCategory());
        product.setMinBid(productRequest.getMinBid());
        product.setMaxBid(productRequest.getMaxBid());
        product.setCurrentBid(0.00);
        product.setEndTime(productRequest.getEndTime());
        product.setSeller(seller);
        product.setFrozen(false);

        Product savedProduct = productRepository.save(product);

        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<?> getMyListings(@AuthenticationPrincipal User seller) {
        List<Product> products = productRepository.findBySellerId(seller.getId());

        List<Map<String, Object>> response = new ArrayList<>();

        for (Product product : products) {
            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("id", product.getId());
            productInfo.put("name", product.getName());
            productInfo.put("description", product.getDescription());
            productInfo.put("category", product.getCategory());

            if (product.isSold()) {
                productInfo.put("status", "SOLD");
                productInfo.put("price", product.getCurrentBid());
                productInfo.put("buyer", product.getBuyer().getFirstName() + " " + product.getBuyer().getLastName());
            } else if (product.isFrozen()) {
                productInfo.put("status", "FROZEN");
            } else {
                productInfo.put("status", "ACTIVE");

                Optional<Bid> topBid = bidRepository.findTopByProductIdOrderByAmountDesc(product.getId());
                topBid.ifPresent(bid -> {
                    productInfo.put("currentBid", bid.getAmount());
                    productInfo.put("topBidder", bid.getBidder().getFirstName() + " " + bid.getBidder().getLastName());
                });
            }

            response.add(productInfo);
        }

        return ResponseEntity.ok(response);
    }
}
