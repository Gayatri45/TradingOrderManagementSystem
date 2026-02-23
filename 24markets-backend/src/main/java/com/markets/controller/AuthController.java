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
                        .body(new AuthResponse("User already exists", null, null, null, null, null, null));
            }

            // Create new user with hashed password
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            // user.setFullName(request.getEmail().split("@")[0]); // Default name
            user.setFullName(request.getFirstName()+" "+request.getLastName()); // Default name
            user.setWalletBalance(1000.0);
            user.setStatus("ACTIVE");
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userService.createUser(user);

            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());
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
                    expiresIn
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Registration failed: " + e.getMessage(), null, null, null, null, null, null));
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
                        .body(new AuthResponse("Invalid credentials", null, null, null, null, null, null));
            }

            User foundUser = user.get();

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse("Invalid credentials", null, null, null, null, null, null));
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(foundUser.getEmail(), foundUser.getId());
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
                    expiresIn
            );

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Login failed: " + e.getMessage(), null, null, null, null, null, null));
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

        return ResponseEntity.ok(new AuthResponse("Logout successful", null, null, null, null, null, null));
    }

    /**
     * Get current user info
     */
    // @GetMapping("/me")
    // public ResponseEntity<User> getCurrentUser(@RequestAttribute("email") String email) {
    //     var user = userService.getUserByEmail(email);
    //     return user.map(ResponseEntity::ok)
    //             .orElseGet(() -> ResponseEntity.notFound().build());
    // }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestAttribute(value = "email", required = false) String email
    ) {
        if (email == null) {
            return ResponseEntity.status(401).body("Not authenticated");
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
                                                     HttpServletResponse response) {
        try {
            // Generate new JWT token
            String token = jwtUtil.generateToken(email, userId);
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
                    expiresIn
            );

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Token refresh failed: " + e.getMessage(), null, null, null, null, null, null));
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