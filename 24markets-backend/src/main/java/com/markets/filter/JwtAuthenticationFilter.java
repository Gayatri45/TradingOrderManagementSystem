package com.markets.filter;

import com.markets.entity.User;
import com.markets.service.UserService;
import com.markets.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private UserService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {

            // ✅ READ TOKEN FROM HEADER
            String authHeader = request.getHeader("Authorization");

            String token = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }

            if (token != null) {
                String email = jwtUtil.extractEmail(token);

                if (email != null && jwtUtil.isTokenValid(token, email)) {

                    Long userId = jwtUtil.extractUserId(token);
                    // User userDetails = userDetailsService.getUserByEmail(email);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    // null
                                    java.util.Collections.emptyList()
                                    // userDetails.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    request.setAttribute("userId", userId);
                    request.setAttribute("email", email);
                }
            }

        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // ✅ Skip only login/register
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.equals("/api/auth/login")
                || path.equals("/api/auth/register")
                || path.startsWith("/api/health");
    }
}


// package com.markets.filter;

// import com.markets.util.JwtUtil;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.Cookie;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;

// @Component
// @RequiredArgsConstructor
// @Slf4j
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     private final JwtUtil jwtUtil;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request, 
//                                     HttpServletResponse response, 
//                                     FilterChain filterChain) throws ServletException, IOException {
//         try {
//             String token = extractTokenFromCookie(request);

//             if (token != null) {
//                 String email = jwtUtil.extractEmail(token);
                
//                 if (email != null && jwtUtil.isTokenValid(token, email)) {
//                     Long userId = jwtUtil.extractUserId(token);
                    
//                     UsernamePasswordAuthenticationToken authentication =
//                             new UsernamePasswordAuthenticationToken(
//                                     email,
//                                     userId,
//                                     null
//                             );
                    
//                     SecurityContextHolder.getContext().setAuthentication(authentication);
//                     request.setAttribute("userId", userId);
//                     request.setAttribute("email", email);
//                 }
//             }
//         } catch (Exception e) {
//             log.error("JWT token validation failed: {}", e.getMessage());
//         }

//         filterChain.doFilter(request, response);
//     }

//     /**
//      * Extract JWT token from HttpOnly cookie
//      */
//     private String extractTokenFromCookie(HttpServletRequest request) {
//         Cookie[] cookies = request.getCookies();
//         if (cookies != null) {
//             for (Cookie cookie : cookies) {
//                 if ("authToken".equals(cookie.getName())) {
//                     return cookie.getValue();
//                 }
//             }
//         }
//         return null;
//     }

//     /**
//      * Excluded paths that don't need JWT validation
//      */
//     @Override
//     protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
//         String path = request.getRequestURI();
//         return path.startsWith("/api/auth/") || 
//                path.startsWith("/api/health") || 
//                path.startsWith("/api/markets/") ||
//                path.startsWith("/api/users/register");
//     }

//     // @Override
//     // protected boolean shouldNotFilter(HttpServletRequest request) {
//     //     String path = request.getRequestURI();

//     //     // Skip ONLY login & register
//     //     return path.equals("/api/auth/login") ||
//     //         path.equals("/api/auth/register") ||
//     //         path.startsWith("/api/health");
//     // }
// }