package com.markets.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // EMAIL
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(nullable = false, unique = true)
    private String email;

    // PASSWORD

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    @Column(nullable = false)
    private String password; // Store hashed password only

    // FULL NAME

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String fullName;

    // WALLET

    @NotNull(message = "Wallet balance cannot be null")
    @PositiveOrZero(message = "Wallet balance cannot be negative")
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal walletBalance = BigDecimal.ZERO;

    // @Column(nullable = false)
    // private Double walletBalance = 0.0;

    // STATUS

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "ACTIVE|INACTIVE|SUSPENDED",
        message = "Status must be ACTIVE, INACTIVE, or SUSPENDED"
    )
    @Column(nullable = false)
    private String status = "ACTIVE";

    // ROLE

    @NotBlank(message = "Role is required")
    @Pattern(
        regexp = "ROLE_USER|ROLE_ADMIN",
        message = "Role must be ROLE_USER or ROLE_ADMIN"
    )
    @Column(nullable = false)
    private String role;

    // Optional (you don't really need both role & isAdmin)
    @Column(name = "is_admin")
    private Boolean isAdmin;

    // TIMESTAMPS

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}