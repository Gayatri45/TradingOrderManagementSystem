package com.markets.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String email;
    private String token;
    private Long userId;
    private String fullName;
    private BigDecimal walletBalance;
    private Long expiresIn; // milliseconds
    private Boolean isAdmin;
}