package com.example.eBaazee.service;

import com.example.eBaazee.entities.Category;
import com.example.eBaazee.entities.Product;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface ProductService {

    List<Product> getAllProducts();

    List<Product> searchProducts(String keyword);

    List<Product> getProductsByCategory(Category category);

    List<Product> getProductsByPriceRange(double minPrice, double maxPrice);

    List<Product> getProductsByLocation(String location);

    List<Product> getProductsBySeller(Long sellerId);

    List<Product> getProductsByBid(Long bidId);

    List<Product> getProductsByBidder(Long bidderId);

}
