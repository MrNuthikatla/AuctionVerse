package com.example.eBaazee.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String title;
    private String description;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private double minBid;
    private double maxBid;
    @Enumerated(EnumType.STRING)
    private ProductStatus status; // ACTIVE, FROZEN, SOLD
    private Double finalPrice;
    @OneToMany(mappedBy = "product")
    private List<Bid> bids;

    public enum ProductStatus {
        ACTIVE, FROZEN, SOLD
    }
}
