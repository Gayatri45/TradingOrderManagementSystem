package com.markets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long id;
    private Long userId;
    private Long marketId;
    private String orderType;
    private Double quantity;
    private Double pricePerUnit;
    private Double totalAmount;
    private String status;
}