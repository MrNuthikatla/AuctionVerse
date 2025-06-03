package com.example.RoleBasedAuth.dto;

import com.example.RoleBasedAuth.model.Bid;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class BidDTO {
    private Integer id;
    private Integer amount;
    private LocalDateTime bidTime;

    private Integer productId;
    private String productName;
    private boolean isSold;
    private boolean isFrozen;
    private Integer buyerId;
    private LocalDateTime endTime;

    public BidDTO(Bid bid) {
        this.id = bid.getId();
        this.amount = bid.getAmount();
        this.bidTime = bid.getBidTime();

        if (bid.getProduct() != null) {
            this.productId = bid.getProduct().getId();
            this.productName = bid.getProduct().getName();
            this.isSold = bid.getProduct().isSold();
            this.isFrozen = bid.getProduct().isFrozen();
            this.endTime = bid.getProduct().getEndTime();
            if (bid.getProduct().getBuyer() != null) {
                this.buyerId = bid.getProduct().getBuyer().getId();
            }
        }
    }
}