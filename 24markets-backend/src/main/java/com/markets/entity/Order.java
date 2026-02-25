package com.markets.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RELATIONS

    @NotNull(message = "User is required")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Market is required")
    @ManyToOne
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;

    // ORDER DATA

    @NotBlank(message = "Order type is required")
    @Pattern(
        regexp = "BUY|SELL",
        message = "Order type must be BUY or SELL"
    )
    @Column(nullable = false)
    private String orderType;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal quantity;

    @NotNull(message = "Price per unit is required")
    @Positive(message = "Price per unit must be greater than 0")
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal pricePerUnit;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be greater than 0")
     @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal totalAmount;

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "PENDING|COMPLETED|CANCELLED",
        message = "Status must be PENDING, COMPLETED, or CANCELLED"
    )   
    @Column(nullable = false)
    private String status = "PENDING";    

    // TIMESTAMPS

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}