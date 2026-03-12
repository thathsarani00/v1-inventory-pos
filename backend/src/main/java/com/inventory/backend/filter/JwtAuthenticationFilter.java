package com.inventory.backend.filter;

import com.inventory.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter that extends OncePerRequestFilter.
 * This filter intercepts every request to validate JWT tokens and set authentication.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }
    
    /**
     * Main filter method that processes each request once per request.
     * 
     * @param request the HTTP request
     * @param response the HTTP response
     * @param filterChain the filter chain to continue processing
     * @throws ServletException if a servlet error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // Step 1: Extract the Authorization header
        final String authHeader = request.getHeader("Authorization");
        
        // If no Authorization header or doesn't start with "Bearer ", skip this filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            // Step 2: Extract JWT token (remove "Bearer " prefix)
            final String jwt = authHeader.substring(7);
            
            // Extract username from token
            final String userEmail = jwtService.extractUsername(jwt);
            
            // Step 3 & 4: If username exists and user is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Load user details from database
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                // Validate token with user details
                if (jwtService.validateToken(jwt, userDetails)) {
                    
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // Set additional details from the request
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // Set authentication in SecurityContextHolder
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Log the exception (optional: add logging framework)
            logger.error("Cannot set user authentication: {}", e);
        }
        
        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
    
    /**
     * Determines whether this filter should be applied to the given request.
     * Can be overridden to skip filtering for certain paths (e.g., /auth/**, /public/**).
     * 
     * @param request the HTTP request
     * @return true to skip filtering, false to apply the filter
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        
        // Skip JWT validation for public endpoints
        return path.startsWith("/v1/auth/") || 
               path.startsWith("/auth/") ||
               path.startsWith("/h2-console/") ||
               path.equals("/") ||
               path.startsWith("/static/") ||
               path.startsWith("/assets/") ||
               path.endsWith(".html") ||
               path.endsWith(".js") ||
               path.endsWith(".css") ||
               path.endsWith(".ico") ||
               path.endsWith(".png") ||
               path.endsWith(".jpg");
    }
}
