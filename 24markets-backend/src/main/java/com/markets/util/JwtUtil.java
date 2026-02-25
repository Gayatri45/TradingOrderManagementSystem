package com.markets.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // =========================================================
    // ✅ Generate JWT Token
    // =========================================================
    public String generateToken(String email, Long userId, String role) {

        // Always store role with ROLE_ prefix
        if (!role.startsWith("ROLE_"))
            role = "ROLE_" + role;

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        claims.put("role", role);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    /**
     * Create JWT token with claims
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        // return Jwts.builder()
        //         .setClaims(claims)
        //         .setSubject(subject)
        //         .setIssuedAt(now)
        //         .setExpiration(expiryDate)
        //         .signWith(key, SignatureAlgorithm.HS512)
        //         .compact();
           return Jwts.builder()
            .claims(claims)
            .subject(subject)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(key)
            .compact();
    }

    // =========================================================
    // ✅ Extract Claims
    // =========================================================
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        Object userId = extractAllClaims(token).get("userId");

        if (userId instanceof Integer)
            return ((Integer) userId).longValue();

        if (userId instanceof Long)
            return (Long) userId;

        return null;
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // =========================================================
    // ✅ Validate Token
    // =========================================================
    public boolean isTokenValid(String token, String email) {
        try {
            return extractEmail(token).equals(email)
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    public long getExpirationTime(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.getTime() - System.currentTimeMillis();
    }
}



// package com.markets.util;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// // import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;
// import jakarta.annotation.PostConstruct;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;

// @Component
// public class JwtUtil {

//     @Value("${jwt.secret}")
//     private String jwtSecret;

//     @Value("${jwt.expiration}")
//     private long jwtExpiration;

//     /**
//      * Generate JWT token
//      */
//     public String generateToken(String email, Long userId, String role) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("userId", userId);
//         claims.put("email", email);
//         claims.put("role", role);
//         return createToken(claims, email);
//     }


//     /**
//      * Extract email from token
//      */
//     public String extractEmail(String token) {
//         return extractAllClaims(token).getSubject();
//     }

//     /**
//      * Extract userId from token
//      */
//     public Long extractUserId(String token) {
//         Claims claims = extractAllClaims(token);
//         Object userId = claims.get("userId");
//         if (userId instanceof Integer) {
//             return ((Integer) userId).longValue();
//         }
//         return (Long) userId;
//     }

//     /**
//      * Extract all claims from token
//      */
//     private Claims extractAllClaims(String token) {
//         SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
//         // return Jwts.parserBuilder()
//         //         .setSigningKey(key)
//         //         .build()
//         //         .parseClaimsJws(token)
//         //         .getBody();

//          return Jwts.parser()
//             .verifyWith(key)
//             .build()
//             .parseSignedClaims(token)
//             .getPayload();
//     }

//     /**
//      * Validate token
//      */
//     public boolean isTokenValid(String token, String email) {
//         try {
//             final String tokenEmail = extractEmail(token);
//             return tokenEmail.equals(email) && !isTokenExpired(token);
//         } catch (Exception e) {
//             return false;
//         }
//     }

//     /**
//      * Check if token is expired
//      */
//     private boolean isTokenExpired(String token) {
//         try {
//             return extractAllClaims(token).getExpiration().before(new Date());
//         } catch (Exception e) {
//             return true;
//         }
//     }

//     /**
//      * Get remaining time in milliseconds
//      */
//     public long getExpirationTime(String token) {
//         Date expiration = extractAllClaims(token).getExpiration();
//         return expiration.getTime() - System.currentTimeMillis();
//     }
// // }

