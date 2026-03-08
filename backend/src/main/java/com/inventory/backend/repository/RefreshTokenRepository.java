package com.inventory.backend.repository;

import com.inventory.backend.model.RefreshToken;
import com.inventory.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Repository for RefreshToken entity operations.
 * Provides CRUD operations and custom queries for refresh token management.
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    /**
     * Find a refresh token by its token string.
     * 
     * @param token the token string to search for
     * @return Optional containing the RefreshToken if found
     */
    Optional<RefreshToken> findByToken(String token);
    
    /**
     * Delete all refresh tokens associated with a specific user.
     * 
     * @param user the user whose tokens should be deleted
     * @return the number of tokens deleted
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken rt WHERE rt.user = :user")
    int deleteByUser(User user);
    
    /**
     * Delete all refresh tokens associated with a specific user ID.
     * 
     * @param userId the ID of the user whose tokens should be deleted
     * @return the number of tokens deleted
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
    int deleteByUserId(Long userId);
}
