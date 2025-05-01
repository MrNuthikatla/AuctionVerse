package com.example.eBaazee.controller;

import com.example.eBaazee.entities.Bid;
import com.example.eBaazee.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bidder")
public class BidController {

  @Autowired
  private BidService bidService;

  @PostMapping("/place")
  public Bid placeBid(@RequestParam Long productId,
    @RequestParam Long userId,
    @RequestParam double price) {
    return bidService.placeBid(productId, userId, price);
  }

  @GetMapping("/bids")
  public List<Bid> viewBids(@RequestParam Long productId) {
    return bidService.getBidsForProduct(productId);
  }

  @GetMapping("/stats")
  public String bidStats(@RequestParam Long productId) {
    return "Total Bidders: " + bidService.getBidderCount(productId) +
      ", Avg. Price: " + bidService.getAverageBid(productId);
  }
}
