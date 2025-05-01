package com.example.eBaazee.service;

import com.example.eBaazee.entities.Bid;
import java.util.List;

public interface BidService {
    Bid placeBid(Long productId, Long userId, double price);

    List<Bid> getBidsForProduct(Long productId);

    double getAverageBid(Long productId);

    int getBidderCount(Long productId);

    double getHighestBid(Long productId);
}
