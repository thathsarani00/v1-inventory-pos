package com.inventory.backend.service;

import com.inventory.backend.model.RefreshToken;
import com.inventory.backend.model.User;
import com.inventory.backend.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for managing refresh tokens.
 * Handles creation, verification, and deletion of refresh tokens.
 */
@Service
public class RefreshTokenService {
    
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    
    // Refresh token validity: 7 days in seconds
    private static final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60L;
    
    /**
     * Creates a new refresh token for the specified user.
     * The token is valid for 7 days.
     * 
     * @param user the user for whom to create the refresh token
     * @return the created RefreshToken entity
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Delete any existing refresh tokens for this user
        refreshTokenRepository.deleteByUserId(user.getId());
        
        // Create new refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(REFRESH_TOKEN_VALIDITY));
        
        return refreshTokenRepository.save(refreshToken);
    }
    
    /**
     * Finds a refresh token by its token string.
     * 
     * @param token the token string to search for
     * @return Optional containing the RefreshToken if found
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
    
    /**
     * Verifies if a refresh token is valid (exists and not expired).
     * 
     * @param token the RefreshToken to verify
     * @return the verified RefreshToken
     * @throws RuntimeException if the token is expired
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token has expired. Please login again.");
        }
        return token;
    }
    
    /**
     * Deletes all refresh tokens for a specific user.
     * Useful for logout functionality.
     * 
     * @param userId the ID of the user whose tokens should be deleted
     * @return the number of tokens deleted
     */
    @Transactional
    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUserId(userId);
    }
    
    /**
     * Deletes a specific refresh token.
     * 
     * @param token the token to delete
     */
    @Transactional
    public void deleteRefreshToken(RefreshToken token) {
        refreshTokenRepository.delete(token);
    }
}
