package com.example.RoleBasedAuth.controller;

import com.example.RoleBasedAuth.model.Bid;
import com.example.RoleBasedAuth.model.Product;
import com.example.RoleBasedAuth.model.Role;
import com.example.RoleBasedAuth.model.User;
import com.example.RoleBasedAuth.repository.BidRepository;
import com.example.RoleBasedAuth.repository.ProductRepository;
import com.example.RoleBasedAuth.repository.UserRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BidRepository bidRepository;

    // List all products
    @GetMapping("/products")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/products/{id}/state")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> changeProductState(
        @PathVariable Integer id,
        @RequestBody ProductStateChangeRequest request) {
        return productRepository.findById(id)
            .map(product -> {
                if (request.getIsFrozen() != null) {
                    product.setFrozen(request.getIsFrozen());
                }
                if (request.getIsSold() != null) {
                    product.setSold(request.getIsSold());
                }
                productRepository.save(product);
                return ResponseEntity.ok(product);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Create new user
    @PostMapping("/users/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User userRequest) {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRequest.getRole() == null) {
            userRequest.setRole(Role.BUYER);
        }
        User savedUser = userRepository.save(userRequest);
        return ResponseEntity.ok(savedUser);
    }

    // List all users
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/products/report")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<byte[]> downloadProductReport() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Product Report");

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Product ID", "Product Name", "Highest Bid Price", "Lowest Bid Price", "Total Bidders"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderCellStyle(workbook));
            }

            // Fetch product data
            List<Product> products = productRepository.findAll();
            int rowIndex = 1;

            for (Product product : products) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(product.getId());
                row.createCell(1).setCellValue(product.getName());

                // Assuming you have methods to fetch bid details
                List<Bid> bids = bidRepository.findByProduct(product);
                List<Integer> bidPrices = bids.stream()
                        .map(Bid::getAmount)
                        .toList();
                if (!bidPrices.isEmpty()) {
                    double highestBid = bidPrices.stream().max(Double::compare).orElse(0);
                    double lowestBid = bidPrices.stream().min(Double::compare).orElse(0);
                    row.createCell(2).setCellValue(highestBid);
                    row.createCell(3).setCellValue(lowestBid);
                    row.createCell(4).setCellValue(bidPrices.size());
                } else {
                    row.createCell(2).setCellValue(0);
                    row.createCell(3).setCellValue(0);
                    row.createCell(4).setCellValue(0);
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Return as downloadable file
            HttpHeaders headersResponse = new HttpHeaders();
            headersResponse.add("Content-Disposition", "attachment; filename=Product_Report.xlsx");
            return new ResponseEntity<>(outputStream.toByteArray(), headersResponse, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private CellStyle createHeaderCellStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    @Setter
    @Getter
    public static class ProductStateChangeRequest {
        private Boolean isFrozen;
        private Boolean isSold;
    }
}