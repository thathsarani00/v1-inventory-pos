package com.inventory.backend.listener;

import com.inventory.backend.service.UserService;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

/**
 * Listener that handles authentication failure events.
 * Increments the failed login attempt counter for users.
 * Locks the account after 5 consecutive failed attempts.
 */
@Component
public class AuthenticationFailureListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {
    
    private final UserService userService;

    public AuthenticationFailureListener(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Called when an authentication failure event occurs (bad credentials).
     * Increments the failed attempt counter for the user.
     * If the counter reaches 5, the account will be locked.
     * 
     * @param event the authentication failure event
     */
    @Override
    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
        String username = (String) event.getAuthentication().getPrincipal();
        
        // Increment failed attempts for this user
        userService.increaseFailedAttempts(username);
    }
}
