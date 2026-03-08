package com.inventory.backend.listener;

import com.inventory.backend.model.User;
import com.inventory.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

/**
 * Listener that handles authentication success events.
 * Resets the failed login attempt counter to 0 after a successful login.
 */
@Component
@RequiredArgsConstructor
public class AuthenticationSuccessListener implements ApplicationListener<AuthenticationSuccessEvent> {
    
    private final UserService userService;
    
    /**
     * Called when an authentication success event occurs.
     * Resets the failed attempt counter to 0 for the authenticated user.
     * 
     * @param event the authentication success event
     */
    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        String username = ((User) event.getAuthentication().getPrincipal()).getUsername();
        
        // Reset failed attempts counter on successful login
        userService.resetFailedAttempts(username);
    }
}
