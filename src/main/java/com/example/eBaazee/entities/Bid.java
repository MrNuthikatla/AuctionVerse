package com.example.eBaazee.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bids", uniqueConstraints = {@UniqueConstraint(columnNames = {"product_id", "bidder_id"})})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bid {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long bidId;

  @ManyToOne
  @JoinColumn(name = "product_id")
  private Product product;

  @ManyToOne
  @JoinColumn(name = "bidder_id")
  private User bidder;

  private double bidPrice;
  private LocalDateTime bidTime;
}

