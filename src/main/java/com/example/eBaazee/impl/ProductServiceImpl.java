package com.example.eBaazee.impl;

import com.example.eBaazee.entities.Category;
import com.example.eBaazee.entities.Product;
import com.example.eBaazee.repository.ProductRepository;
import com.example.eBaazee.service.ProductService;
import com.example.eBaazee.service.UserService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContaining(keyword);
    }

    @Override
    public List<Product> getProductsByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> getProductsByPriceRange(double minPrice, double maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    public List<Product> getProductsByLocation(String location) {
        return productRepository.findByLocation(location);
    }

    @Override
    public List<Product> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    @Override
    public List<Product> getProductsByBid(Long bidId) {
        return productRepository.findByBidId(bidId);
    }

    @Override
    public List<Product> getProductsByBidder(Long bidderId) {
        return productRepository.findByBidderId(bidderId);
    }

    @Override
    public List<Product> getPopularProducts(int limit, int offset, String sortBy, String orderBy) {
        return productRepository.findPopularProducts(limit, offset, sortBy, orderBy);
    }

    @Override
    public Product updateProductStatus(Long productId, Product.ProductStatus status) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(status);
        return productRepository.save(product);
    }

    @Override
    public Product addProduct(String title, String description, Long sellerId, Category category, double minBid,
                              double maxBid, LocalDateTime startTime, LocalDateTime endTime) {
        // TODO: Validate the seller user
        Product product = new Product();
        UserService userService = new UserServiceImpl();

        product.setTitle(title);
        product.setDescription(description);
        product.setSeller(userService.getUserById(sellerId));
        product.setCategory(category);
        product.setMinBid(minBid);
        product.setMaxBid(maxBid);
        product.setStartTime(startTime);
        product.setEndTime(endTime);
        return productRepository.save(product);
    }

}
