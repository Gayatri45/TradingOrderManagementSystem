package com.markets.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    @JsonProperty("isAdmin")
    private Boolean isAdmin;
}