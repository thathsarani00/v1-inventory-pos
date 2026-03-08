package com.inventory.backend.service;

import com.inventory.backend.model.User;
import com.inventory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom UserDetailsService implementation for Spring Security.
 * Loads user details from the database using UserRepository.
 * Checks account status including locked accounts due to failed login attempts.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    /**
     * Loads user by username (email in our case).
     * This method is called by Spring Security during authentication.
     * Spring Security automatically checks isAccountNonLocked() and will
     * reject authentication if the account is locked (returns false).
     * 
     * @param username the username (email) to search for
     * @return UserDetails object containing user information
     * @throws UsernameNotFoundException if user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + username));
        
        // Spring Security will automatically check isAccountNonLocked()
        // and throw LockedException if account is locked
        return user;
    }
}
