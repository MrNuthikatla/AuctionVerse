package com.example.eBaazee.repository;

import com.example.eBaazee.entities.Category;
import com.example.eBaazee.entities.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findBySellerUserId(Long sellerId);

    List<Product> findByNameContaining(String keyword);

    List<Product> findByCategory(Category category);

    List<Product> findByPriceBetween(double minPrice, double maxPrice);

    List<Product> findByLocation(String location);

    List<Product> findBySellerId(Long sellerId);

    List<Product> findByBidId(Long bidId);

    List<Product> findByBidderId(Long bidderId);
}
