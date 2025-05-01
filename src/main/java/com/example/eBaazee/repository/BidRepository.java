package com.example.eBaazee.repository;

import com.example.eBaazee.entities.Bid;
import com.example.eBaazee.entities.Product;
import com.example.eBaazee.entities.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByProduct(Product product);

    boolean existsByProductAndBidder(Product product, User bidder);

    Optional<Bid> findTopByProductOrderByBidPriceDesc(Product product);
}
