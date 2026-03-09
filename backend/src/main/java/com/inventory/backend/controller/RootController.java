package com.inventory.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Root controller for basic API status endpoint.
 */
@RestController
@CrossOrigin(origins = "*")
public class RootController {
    
    /**
     * Root endpoint that returns API status.
     * Accessible at: /v1/ or just /v1
     * 
     * @return JSON response with status, code, and message
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> data = new HashMap<>();
        
        data.put("message", "You are here now...");
        
        response.put("status", "success");
        response.put("code", 200);
        response.put("data", data);
        
        return ResponseEntity.ok(response);
    }
}
