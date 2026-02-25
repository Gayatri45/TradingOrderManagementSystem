package com.markets.controller;

import com.markets.dto.AuthRequest;
import com.markets.dto.AuthResponse;
import com.markets.entity.User;
import com.markets.service.UserService;
import com.markets.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request, HttpServletResponse response) {
        try {
            System.out.println(request);
            // Check if user already exists
            if (userService.getUserByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponse("User already exists", null, null, null, null, null, null, false));
            }

            // Create new user with hashed password
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            // user.setFullName(request.getEmail().split("@")[0]); // Default name
            user.setFullName(request.getFirstName()+" "+request.getLastName()); // Default name
            // user.setWalletBalance(100000.0);
            user.setWalletBalance(new BigDecimal("1000.0"));
            user.setStatus("ACTIVE");
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setIsAdmin(request.getIsAdmin());
            if(request.getIsAdmin()){
                user.setRole("ROLE_ADMIN");
            }else{
                user.setRole("ROLE_USER");
            }
            User savedUser = userService.createUser(user);

            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());
            long expiresIn = jwtUtil.getExpirationTime(token);

            // Set HttpOnly cookie
            setAuthCookie(response, token);

            AuthResponse authResponse = new AuthResponse(
                    "Registration successful",
                    savedUser.getEmail(),
                    token,
                    savedUser.getId(),
                    savedUser.getFullName(),
                    savedUser.getWalletBalance(),
                    expiresIn,
                    savedUser.getIsAdmin()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Registration failed: " + e.getMessage(), null, null, null, null, null, null, false));
        }
    }

    /**
     * Login user
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        try {
            // Find user by email
            var user = userService.getUserByEmail(request.getEmail());
            
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse("Invalid credentials", null, null, null, null, null, null, false));
            }

            User foundUser = user.get();

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse("Invalid credentials", null, null, null, null, null, null, false));
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(foundUser.getEmail(), foundUser.getId(), foundUser.getRole());
            long expiresIn = jwtUtil.getExpirationTime(token);

            // Set HttpOnly cookie
            setAuthCookie(response, token);

            AuthResponse authResponse = new AuthResponse(
                    "Login successful",
                    foundUser.getEmail(),
                    token,
                    foundUser.getId(),
                    foundUser.getFullName(),
                    foundUser.getWalletBalance(),
                    expiresIn,
                    foundUser.getIsAdmin()
            );

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Login failed: " + e.getMessage(), null, null, null, null, null, null, false));
        }
    }

    /**
     * Logout user
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpServletResponse response) {
        // Clear the authentication cookie
        Cookie cookie = new Cookie("authToken", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(new AuthResponse("Logout successful", null, null, null, null, null, null, false));
    }

    /**
     * Get current user info
     */    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestAttribute(value = "email", required = false) String email
    ) {
        if (email == null) {
            return ResponseEntity.status(400).body("Not authenticated");
        }
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestAttribute("email") String email,
                                                     @RequestAttribute("userId") Long userId,
                                                     @RequestAttribute("role") String role,
                                                     HttpServletResponse response) {
        try {
            // Generate new JWT token
            String token = jwtUtil.generateToken(email, userId, role);
            long expiresIn = jwtUtil.getExpirationTime(token);

            // Set HttpOnly cookie
            setAuthCookie(response, token);

            AuthResponse authResponse = new AuthResponse(
                    "Token refreshed",
                    email,
                    token,
                    userId,
                    null,
                    null,
                    expiresIn,
                    false
            );

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Token refresh failed: " + e.getMessage(), null, null, null, null, null, null, false));
        }
    }

    /**
     * Set authentication cookie
     */
    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("authToken", token);
        cookie.setHttpOnly(true); // Prevents JavaScript access
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge((int) (3600)); // 1 hour in seconds
        response.addCookie(cookie);
    }
}