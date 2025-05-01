package com.example.eBaazee.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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

  public enum ProductStatus {
    ACTIVE, FROZEN, SOLD
  }

  @Enumerated(EnumType.STRING)
  private ProductStatus status; // ACTIVE, FROZEN, SOLD

  private Double finalPrice;

  @OneToMany(mappedBy = "product")
  private List<Bid> bids;
}
