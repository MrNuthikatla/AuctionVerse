package com.example.RoleBasedAuth.service;

import com.example.RoleBasedAuth.model.Bid;
import com.example.RoleBasedAuth.model.Product;
import com.example.RoleBasedAuth.repository.BidRepository;
import com.example.RoleBasedAuth.repository.ProductRepository;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductStatusScheduler {

    private final ProductRepository productRepository;
    private final BidRepository bidRepository;

    public ProductStatusScheduler(ProductRepository productRepository, BidRepository bidRepository) {
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
    }

    @Scheduled(fixedDelay = 60000) // every 1 min
    @Transactional
    public void freezeOrSellExpiredProducts() {
        LocalDateTime now = LocalDateTime.now();
        List<Product> productsToCheck = productRepository.findByEndTimeBeforeAndIsFrozenFalse(now);

        for (Product product : productsToCheck) {
            List<Bid> bids = bidRepository.findByProduct(product);

            if (bids.isEmpty()) {
                // No bids: just freeze
                product.setFrozen(true);
                productRepository.save(product);
            } else {
                // Find highest bid by amount
                Bid highestBid = bids.stream()
                    .max(Comparator.comparing(Bid::getAmount))
                    .orElseThrow(); // won't happen, list is not empty

                // Mark product sold to highest bidder
                product.setSold(true);
                product.setBuyer(highestBid.getBidder());
                product.setFrozen(true);
                productRepository.save(product);
            }
        }
    }
}
