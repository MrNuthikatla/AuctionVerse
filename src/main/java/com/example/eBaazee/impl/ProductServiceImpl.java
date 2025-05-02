package com.example.eBaazee.impl;

import com.example.eBaazee.entities.Category;
import com.example.eBaazee.entities.Product;
import com.example.eBaazee.repository.ProductRepository;
import com.example.eBaazee.service.ProductService;
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

}
