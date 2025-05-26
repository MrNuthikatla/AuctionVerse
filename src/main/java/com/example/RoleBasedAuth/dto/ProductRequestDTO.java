package com.example.RoleBasedAuth.dto;

import com.example.RoleBasedAuth.model.Category;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private Category category;
    private double minBid;
    private double maxBid;
    private LocalDateTime endTime;  // Freeze time (auction end)
}
