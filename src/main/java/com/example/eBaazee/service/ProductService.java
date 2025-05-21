package com.example.eBaazee.service;

import com.example.eBaazee.entities.Category;
import com.example.eBaazee.entities.Product;
import java.time.LocalDateTime;
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

    List<Product> getPopularProducts(int limit, int offset, String sortBy, String orderBy);

    Product updateProductStatus(Long productId, Product.ProductStatus status);

    Product addProduct(String title, String description, Long sellerId, Category category, double minBid, double maxBid,
                       LocalDateTime startTime, LocalDateTime endTime);
}
