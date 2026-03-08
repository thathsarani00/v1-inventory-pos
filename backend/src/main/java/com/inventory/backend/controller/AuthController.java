package com.inventory.backend.controller;

import com.inventory.backend.dto.AuthResponse;
import com.inventory.backend.dto.LoginRequest;
import com.inventory.backend.dto.RefreshTokenRequest;
import com.inventory.backend.dto.RefreshTokenResponse;
import com.inventory.backend.dto.RegisterRequest;
import com.inventory.backend.model.RefreshToken;
import com.inventory.backend.model.User;
import com.inventory.backend.service.JwtService;
import com.inventory.backend.service.RefreshTokenService;
import com.inventory.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for authentication endpoints.
 * Handles user login and registration with JWT token generation.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    
    /**
     * Login endpoint that authenticates user and returns JWT token.
     * 
     * @param loginRequest contains email and password (validated)
     * @return AuthResponse with JWT token and user details
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            
            // Get authenticated user
            User user = (User) authentication.getPrincipal();
            
            // Check if account is active
            if (!user.getActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Account is inactive"));
            }
            
            // Generate JWT access token (15 minutes)
            String accessToken = jwtService.generateToken(user);
            
            // Generate refresh token (7 days)
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
            
            // Create response with both tokens and user details
            AuthResponse response = new AuthResponse(
                    accessToken,
                    refreshToken.getToken(),
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (LockedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Account is locked due to too many failed login attempts. Please contact support."));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred during login: " + e.getMessage()));
        }
    }
    
    /**
     * Registration endpoint for creating new user accounts.
     * 
     * @param registerRequest the user details to register (validated)
     * @return success message with user ID
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Check if user already exists
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email already exists"));
            }
            
            // Create User entity from RegisterRequest
            User user = new User();
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setPhone(registerRequest.getPhone());
            
            // Set default role if not provided
            if (registerRequest.getRole() == null || registerRequest.getRole().isEmpty()) {
                user.setRole("USER");
            } else {
                user.setRole(registerRequest.getRole());
            }
            
            // Create user (password will be hashed by UserService)
            User createdUser = userService.createUser(user);
            
            // Generate JWT access token (15 minutes)
            String accessToken = jwtService.generateToken(createdUser);
            
            // Generate refresh token (7 days)
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(createdUser);
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", createdUser.getId());
            response.put("token", accessToken);
            response.put("refreshToken", refreshToken.getToken());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error registering user: " + e.getMessage()));
        }
    }
    
    /**
     * Refresh token endpoint that generates a new access token using a valid refresh token.
     * 
     * @param refreshTokenRequest contains the refresh token (validated)
     * @return RefreshTokenResponse with new access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        try {
            String requestRefreshToken = refreshTokenRequest.getRefreshToken();
            
            // Find refresh token in database
            RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken)
                    .orElseThrow(() -> new RuntimeException("Refresh token not found"));
            
            // Verify token expiration
            refreshToken = refreshTokenService.verifyExpiration(refreshToken);
            
            // Get user from refresh token
            User user = refreshToken.getUser();
            
            // Generate new access token
            String newAccessToken = jwtService.generateToken(user);
            
            // Return new access token and the same refresh token
            RefreshTokenResponse response = new RefreshTokenResponse(
                    newAccessToken,
                    requestRefreshToken
            );
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error refreshing token: " + e.getMessage()));
        }
    }
}
