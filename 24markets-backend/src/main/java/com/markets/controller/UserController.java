// package com.markets.controller;

// import com.markets.entity.User;
// import com.markets.service.UserService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;

// @RestController
// @RequestMapping("/users")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:5173") // Vite default port
// public class UserController {

//     private final UserService userService;

//     @PostMapping
//     public ResponseEntity<User> createUser(@RequestBody User user) {
//         return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<User> getUserById(@PathVariable Long id) {
//         return userService.getUserById(id)
//                 .map(ResponseEntity::ok)
//                 .orElseGet(() -> ResponseEntity.notFound().build());
//     }

//     @GetMapping
//     public ResponseEntity<List<User>> getAllUsers() {
//         return ResponseEntity.ok(userService.getAllUsers());
//     }

//     @GetMapping("/email/{email}")
//     public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
//         return userService.getUserByEmail(email)
//                 .map(ResponseEntity::ok)
//                 .orElseGet(() -> ResponseEntity.notFound().build());
//     }

//     @PutMapping("/{id}")
//     public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
//         return ResponseEntity.ok(userService.updateUser(id, user));
//     }

//     @PutMapping("/{id}/wallet")
//     public ResponseEntity<User> updateWallet(@PathVariable Long id, @RequestParam Double amount) {
//         return ResponseEntity.ok(userService.updateWalletBalance(id, amount));
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
//         userService.deleteUser(id);
//         return ResponseEntity.noContent().build();
//     }
// }

package com.markets.controller;

import com.markets.entity.User;
import com.markets.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user,
                                          @RequestAttribute("userId") Long authenticatedUserId) {
        // Check if user is updating their own profile
        if (!id.equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @PutMapping("/{id}/wallet")
    public ResponseEntity<User> updateWallet(@PathVariable Long id, @RequestParam Double amount,
                                            @RequestAttribute("userId") Long authenticatedUserId) {
        if (!id.equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.updateWalletBalance(id, amount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id,
                                          @RequestAttribute("userId") Long authenticatedUserId) {
        if (!id.equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}