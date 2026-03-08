package com.inventory.backend.repository;

import com.inventory.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides database access methods for user management and authentication.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find a user by their email address.
     * This is the primary method for authentication as email is used as username.
     * 
     * @param email the email address to search for
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if a user exists with the given email address.
     * Useful for registration validation.
     * 
     * @param email the email address to check
     * @return true if a user with this email exists, false otherwise
     */
    Boolean existsByEmail(String email);
    
    /**
     * Find all users with a specific role.
     * 
     * @param role the role to filter by
     * @return list of users with the specified role
     */
    List<User> findByRole(String role);
    
    /**
     * Find all active or inactive users.
     * 
     * @param active true for active users, false for inactive
     * @return list of users matching the active status
     */
    List<User> findByActive(Boolean active);
    
    /**
     * Find a user by email and check if they are active.
     * Useful for login validation to ensure only active users can authenticate.
     * 
     * @param email the email address to search for
     * @param active the active status to filter by
     * @return Optional containing the user if found and matches criteria, empty otherwise
     */
    Optional<User> findByEmailAndActive(String email, Boolean active);
    
    /**
     * Count the number of users with a specific role.
     * 
     * @param role the role to count
     * @return the number of users with the specified role
     */
    Long countByRole(String role);
    
    /**
     * Count the number of active users.
     * 
     * @return the number of active users
     */
    Long countByActive(Boolean active);
    
    /**
     * Find users by first name or last name containing the search term (case-insensitive).
     * Useful for user search functionality.
     * 
     * @param firstName the first name search term
     * @param lastName the last name search term
     * @return list of users matching the search criteria
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))")
    List<User> searchByName(@Param("firstName") String firstName, @Param("lastName") String lastName);
    
    /**
     * Find all active users with a specific role.
     * 
     * @param role the role to filter by
     * @param active the active status
     * @return list of users matching both criteria
     */
    List<User> findByRoleAndActive(String role, Boolean active);
}
