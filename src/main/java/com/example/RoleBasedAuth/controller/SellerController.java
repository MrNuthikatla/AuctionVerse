package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.dto.ProductRequestDTO;
import com.example.RoleBasedAuth.model.Product;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
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
//        product.setCurrentBid(0.00);
        product.setEndTime(productRequest.getEndTime());
        product.setSeller(seller);
        product.setFrozen(false);

        Product savedProduct = productRepository.save(product);

        return ResponseEntity.ok(savedProduct);
    }
}
