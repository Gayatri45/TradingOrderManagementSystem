package com.markets.service;

import com.markets.entity.User;
import com.markets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // public List<User> getAllUsers() {
    //     return userRepository.findAll();
    // }

    public List<User> getAllUsers() {
        return userRepository.findByRole("ROLE_USER");
    }

    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName());
            user.setWalletBalance(userDetails.getWalletBalance());
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // public User updateWalletBalance(Long userId, Double amount) {
    //     return userRepository.findById(userId).map(user -> {
    //         user.setWalletBalance(user.getWalletBalance() + amount);
    //         user.setUpdatedAt(LocalDateTime.now());
    //         return userRepository.save(user);
    //     }).orElseThrow(() -> new RuntimeException("User not found"));
    // }

    public User updateWalletBalance(Long userId, BigDecimal amount) {

        return userRepository.findById(userId).map(user -> {
            if (user.getWalletBalance() == null) {
                user.setWalletBalance(BigDecimal.ZERO);
            }
            user.setWalletBalance(
                    user.getWalletBalance().add(amount)
            );
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }
}