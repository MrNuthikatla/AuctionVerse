package com.example.RoleBasedAuth.repository;


import com.example.RoleBasedAuth.model.Category;
import com.example.RoleBasedAuth.model.Product;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByEndTimeBeforeAndIsFrozenFalse(LocalDateTime time);

    List<Product> findByCategory(Category category);

    List<Product> findBySellerId(Integer id);

    Optional<Product> findById(Integer id);
}
