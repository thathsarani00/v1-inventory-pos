package com.inventory.backend.service;

import com.inventory.backend.model.User;
import com.inventory.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.getActive());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * Maximum number of failed login attempts before account is locked.
     */
    private static final int MAX_FAILED_ATTEMPTS = 5;
    
    /**
     * Increases the failed login attempt counter for a user.
     * Locks the account if the number of failed attempts reaches the maximum threshold (5).
     * 
     * @param email the email of the user
     */
    public void increaseFailedAttempts(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            int newFailAttempts = user.getFailedAttempt() + 1;
            user.setFailedAttempt(newFailAttempts);
            
            // Lock account if failed attempts reach the maximum
            if (newFailAttempts >= MAX_FAILED_ATTEMPTS) {
                user.setAccountNonLocked(false);
            }
            
            userRepository.save(user);
        }
    }
    
    /**
     * Resets the failed login attempt counter to 0 after a successful login.
     * 
     * @param email the email of the user
     */
    public void resetFailedAttempts(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setFailedAttempt(0);
            userRepository.save(user);
        }
    }
    
    /**
     * Unlocks a user account manually.
     * Resets failed attempts to 0 and sets accountNonLocked to true.
     * This can be used by administrators to unlock accounts.
     * 
     * @param email the email of the user
     */
    public void unlockAccount(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setAccountNonLocked(true);
            user.setFailedAttempt(0);
            userRepository.save(user);
        }
    }
}
