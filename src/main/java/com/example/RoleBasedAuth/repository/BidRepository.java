package com.example.RoleBasedAuth.repository;

import com.example.RoleBasedAuth.model.Bid;
import com.example.RoleBasedAuth.model.Product;
import com.example.RoleBasedAuth.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

public interface BidRepository extends JpaRepository<Bid, Integer> {

    boolean existsByBidderAndProduct(User bidder, Product product);

    List<Bid> findByBidder(User bidder);

    Optional<Bid> findTopByProductOrderByAmountDesc(Product product);

    long countByProduct(Product product);

    Optional<Bid> findByBidderAndProduct(User bidder, Product product);

    @Query("SELECT AVG(b.amount) FROM Bid b WHERE b.product = :product")
    Double findAverageBidAmountByProduct(Product product);

    List<Bid> findByProduct(Product product);
}
