// package com.markets.entity;

// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "users")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class User {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false, unique = true)
//     private String email;

//     @Column(nullable = false)
//     private String password;

//     @Column(nullable = false)
//     private String fullName;

//     @Column(nullable = false)
//     private Double walletBalance = 0.0;

//     @Column(nullable = false)
//     private String status = "ACTIVE";

//     @Column(name = "created_at", nullable = false, updatable = false)
//     private LocalDateTime createdAt = LocalDateTime.now();

//     @Column(name = "updated_at")
//     private LocalDateTime updatedAt = LocalDateTime.now();
// }

package com.markets.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Will store hashed password

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private Double walletBalance = 0.0;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}