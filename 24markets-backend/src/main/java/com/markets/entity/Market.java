package com.markets.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "markets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Market {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // BASIC INFO

    @NotBlank(message = "Market name is required")
    @Size(min = 2, max = 50, message = "Market name must be between 2 and 50 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Symbol is required")
    @Size(min = 2, max = 10, message = "Symbol must be between 2 and 10 characters")
    @Column(nullable = false, unique = true)
    private String symbol;

    // PRICE DATA

    @NotNull(message = "Current price is required")
    @Positive(message = "Current price must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Invalid price format")
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal currentPrice;
    // @Column(nullable = false)
    // private Double currentPrice;

    @NotNull(message = "Open price is required")
    @Positive(message = "Open price must be greater than 0")
    @Digits(integer = 12, fraction = 2)
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal openPrice;
    // @Column(nullable = false)
    // private Double openPrice;

    @NotNull(message = "High price is required")
    @Positive(message = "High price must be greater than 0")
    @Digits(integer = 12, fraction = 2)
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal highPrice;
    // @Column(nullable = false)
    // private Double highPrice;

    @NotNull(message = "Low price is required")
    @Positive(message = "Low price must be greater than 0")
    @Digits(integer = 12, fraction = 2)
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal lowPrice;
    // @Column(nullable = false)
    // private Double lowPrice;

    // VOLUME

    @NotNull(message = "Volume is required")
    @PositiveOrZero(message = "Volume cannot be negative")
    @Column(nullable = false)
    private Long volume;

    // TIMESTAMPS

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}