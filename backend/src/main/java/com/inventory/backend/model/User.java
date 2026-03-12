package com.inventory.backend.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

/**
 * User entity class that implements Spring Security's UserDetails interface.
 * This entity represents a user in the system with authentication and authorization capabilities.
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_role", columnList = "role"),
    @Index(name = "idx_active", columnList = "active")
})
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;  // BCrypt hashed password
    
    private String phone;
    
    @Column(nullable = false)
    private String role;  // SUPER_ADMIN, ADMIN, USER, MANAGER, etc.
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(name = "failed_attempt")
    private Integer failedAttempt = 0;
    
    @Column(name = "account_non_locked")
    private Boolean accountNonLocked = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) {
            active = true;
        }
        if (failedAttempt == null) {
            failedAttempt = 0;
        }
        if (accountNonLocked == null) {
            accountNonLocked = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ========== Constructors ==========

    public User() {}

    public User(Long id, String firstName, String lastName, String email, String password,
                String phone, String role, Boolean active, Integer failedAttempt,
                Boolean accountNonLocked, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.active = active;
        this.failedAttempt = failedAttempt;
        this.accountNonLocked = accountNonLocked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ========== Getters and Setters ==========

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Integer getFailedAttempt() { return failedAttempt; }
    public void setFailedAttempt(Integer failedAttempt) { this.failedAttempt = failedAttempt; }

    public Boolean getAccountNonLocked() { return accountNonLocked; }
    public void setAccountNonLocked(Boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // ========== UserDetails Interface Methods ==========
    
    /**
     * Returns the authorities granted to the user based on their role.
     * Prefixes the role with "ROLE_" as per Spring Security convention.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + role)
        );
    }
    
    /**
     * Returns the password used to authenticate the user.
     * This should be the BCrypt hashed password.
     */
    @Override
    public String getPassword() {
        return password;
    }
    
    /**
     * Returns the username used to authenticate the user.
     * In this implementation, the email is used as the username.
     */
    @Override
    public String getUsername() {
        return email;
    }
    
    /**
     * Indicates whether the user's account has expired.
     * An expired account cannot be authenticated.
     * 
     * @return true if the user's account is valid (non-expired), false otherwise
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;  // Can be enhanced to check account expiration date
    }
    
    /**
     * Indicates whether the user is locked or unlocked.
     * A locked user cannot be authenticated.
     * Returns false if account is locked due to too many failed login attempts.
     * 
     * @return true if the user is not locked, false otherwise
     */
    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked != null && accountNonLocked;
    }
    
    /**
     * Indicates whether the user's credentials (password) has expired.
     * Expired credentials prevent authentication.
     * 
     * @return true if the user's credentials are valid (non-expired), false otherwise
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // Can be enhanced to implement password expiration
    }
    
    /**
     * Indicates whether the user is enabled or disabled.
     * A disabled user cannot be authenticated.
     * 
     * @return true if the user is enabled, false otherwise
     */
    @Override
    public boolean isEnabled() {
        return active != null && active;
    }
    
    // ========== Helper Methods ==========
    
    /**
     * Returns the full name of the user.
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    /**
     * Checks if the user has a specific role.
     * 
     * @param roleName the role name to check (without ROLE_ prefix)
     * @return true if user has the role, false otherwise
     */
    public boolean hasRole(String roleName) {
        return this.role != null && this.role.equalsIgnoreCase(roleName);
    }
}
