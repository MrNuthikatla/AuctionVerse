package com.example.RoleBasedAuth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidStatusDTO {
    private Integer productId;
    private String productName;
    private long totalBidders;
    private double averageBidAmount;
    private double maxBidAmount;

    // Optional fields for current user's bid
    private Integer userBidAmount;
    private boolean hasUserBid;
}
