package com.example.eBaazee.controller;

import com.example.eBaazee.entities.Category;
import com.example.eBaazee.entities.Product;
import com.example.eBaazee.service.ProductService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }

    @GetMapping("/category")
    public List<Product> getProductsByCategory(@RequestParam Category category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/price")
    public List<Product> getProductsByPriceRange(@RequestParam double minPrice, @RequestParam double maxPrice) {
        return productService.getProductsByPriceRange(minPrice, maxPrice);
    }

    @GetMapping("/location")
    public List<Product> getProductsByLocation(@RequestParam String location) {
        return productService.getProductsByLocation(location);
    }

    @GetMapping("/seller")
    public List<Product> getProductsBySeller(@RequestParam Long sellerId) {
        return productService.getProductsBySeller(sellerId);
    }

    @GetMapping("/bid")
    public List<Product> getProductsByBid(@RequestParam Long bidId) {
        return productService.getProductsByBid(bidId);
    }

    @GetMapping("/bidder")
    public List<Product> getProductsByBidder(@RequestParam Long bidderId) {
        return productService.getProductsByBidder(bidderId);
    }
}