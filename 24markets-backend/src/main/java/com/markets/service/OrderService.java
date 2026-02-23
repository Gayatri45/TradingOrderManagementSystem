package com.markets.service;

import com.markets.entity.Order;
import com.markets.entity.User;
import com.markets.entity.Market;
import com.markets.repository.OrderRepository;
import com.markets.repository.UserRepository;
import com.markets.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MarketRepository marketRepository;

    public Order createOrder(Order order) {
        User user = userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Market market = marketRepository.findById(order.getMarket().getId())
                .orElseThrow(() -> new RuntimeException("Market not found"));

        // Calculate total amount
        order.setTotalAmount(order.getQuantity() * order.getPricePerUnit());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setStatus("PENDING");

        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByMarketId(Long marketId) {
        return orderRepository.findByMarketId(marketId);
    }

    public Order updateOrderStatus(Long id, String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}