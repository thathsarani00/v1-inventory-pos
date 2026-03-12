package com.inventory.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for refresh token requests.
 * Used when requesting a new access token using a refresh token.
 */
public class RefreshTokenRequest {
    
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;

    public RefreshTokenRequest() {}

    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
