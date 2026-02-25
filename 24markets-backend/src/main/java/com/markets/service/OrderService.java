package com.markets.service;

import com.markets.entity.Order;
import com.markets.entity.User;
import com.markets.exception.OrderNotFoundException;
import com.markets.entity.Market;
import com.markets.dto.OrderDTO;
import com.markets.repository.OrderRepository;
import com.markets.repository.UserRepository;
import com.markets.repository.MarketRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MarketRepository marketRepository;
    private final StringRedisTemplate redis;

    private static final String USER_ORDER_COUNT = "user:%d:orderCount";
    private static final String RECENT_ORDERS = "recent:orders";

    // CREATE ORDER
    // @CacheEvict(value = "orders", allEntries = true)
    // @Transactional
    // public Order createOrder(Order orderRequest) {

    //     User user = userRepository.findById(orderRequest.getUser().getId())
    //             .orElseThrow(() -> new RuntimeException("User not found"));

    //     Market market = marketRepository.findById(orderRequest.getMarket().getId())
    //             .orElseThrow(() -> new RuntimeException("Market not found"));

    //     double total = orderRequest.getQuantity() * orderRequest.getPricePerUnit();

    //     if ("BUY".equalsIgnoreCase(orderRequest.getOrderType())) {

    //         if (user.getWalletBalance() < total)
    //             throw new RuntimeException("Insufficient wallet balance");

    //         user.setWalletBalance(user.getWalletBalance() - total);

    //     } else if ("SELL".equalsIgnoreCase(orderRequest.getOrderType())) {

    //         user.setWalletBalance(user.getWalletBalance() + total);

    //     } else {
    //         throw new RuntimeException("Invalid order type");
    //     }

    //     userRepository.save(user);

    //     Order order = new Order();
    //     order.setUser(user);
    //     order.setMarket(market);
    //     order.setOrderType(orderRequest.getOrderType());
    //     order.setQuantity(orderRequest.getQuantity());
    //     order.setPricePerUnit(orderRequest.getPricePerUnit());
    //     order.setTotalAmount(total);
    //     order.setStatus("PENDING");
    //     order.setCreatedAt(LocalDateTime.now());
    //     order.setUpdatedAt(LocalDateTime.now());

    //     Order savedOrder = orderRepository.save(order);

    //     // =====================================================
    //     // ✅ REDIS FEATURES
    //     // =====================================================

    //     // 1️⃣ Increment user order counter
    //     redis.opsForValue().increment(
    //             String.format(USER_ORDER_COUNT, user.getId())
    //     );

    //     // 2️⃣ Add to global recent orders list
    //     redis.opsForList().leftPush(RECENT_ORDERS, savedOrder.getId().toString());
    //     redis.opsForList().trim(RECENT_ORDERS, 0, 9); // keep last 10

    //     return savedOrder;
    // }


    @CacheEvict(value = "orders", allEntries = true)
    @Transactional
    public Order createOrder(Order orderRequest) {

        User user = userRepository.findById(orderRequest.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Market market = marketRepository.findById(orderRequest.getMarket().getId())
                .orElseThrow(() -> new RuntimeException("Market not found"));

        // ✅ Calculate total using BigDecimal
        BigDecimal total = orderRequest.getQuantity()
                .multiply(orderRequest.getPricePerUnit());

        // =====================================================
        // BUY ORDER
        // =====================================================
        if ("BUY".equalsIgnoreCase(orderRequest.getOrderType())) {

            if (user.getWalletBalance().compareTo(total) < 0) {
                throw new RuntimeException("Insufficient wallet balance");
            }

            user.setWalletBalance(
                    user.getWalletBalance().subtract(total)
            );

        }

        // =====================================================
        // SELL ORDER
        // =====================================================
        else if ("SELL".equalsIgnoreCase(orderRequest.getOrderType())) {

            user.setWalletBalance(
                    user.getWalletBalance().add(total)
            );

        }

        else {
            throw new RuntimeException("Invalid order type");
        }

        userRepository.save(user);

        Order order = new Order();
        order.setUser(user);
        order.setMarket(market);
        order.setOrderType(orderRequest.getOrderType());
        order.setQuantity(orderRequest.getQuantity());
        order.setPricePerUnit(orderRequest.getPricePerUnit());
        order.setTotalAmount(total);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // =====================================================
        // ✅ REDIS FEATURES
        // =====================================================
        redis.opsForValue().increment(
                String.format(USER_ORDER_COUNT, user.getId())
        );

        redis.opsForList().leftPush(RECENT_ORDERS, savedOrder.getId().toString());
        redis.opsForList().trim(RECENT_ORDERS, 0, 9);

        return savedOrder;
    }

    // GET ORDER COUNT
    public Long getUserOrderCount(Long userId) {
        String value = redis.opsForValue()
                .get(String.format(USER_ORDER_COUNT, userId));

        return value != null ? Long.parseLong(value) : 0L;
    }

    // GET RECENT ORDERS
    public List<Order> getRecentOrders() {

        List<String> ids = redis.opsForList()
                .range(RECENT_ORDERS, 0, 9);

        if (ids == null || ids.isEmpty()) return List.of();

        List<Long> orderIds = ids.stream()
                .map(Long::valueOf)
                .collect(Collectors.toList());

        return orderRepository.findAllById(orderIds);
    }

    // CANCEL ORDER
    @CacheEvict(value = "orders", key = "#orderId")
    @Transactional
    public void cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found with id " + orderId));              

        if ("CANCELLED".equals(order.getStatus()))
            return;

        User user = order.getUser();
        // user.setWalletBalance(user.getWalletBalance() + order.getTotalAmount());
        // user.setWalletBalance(
        //     user.getWalletBalance().add(BigDecimal.valueOf(order.getTotalAmount()))
        // );
        user.setWalletBalance(
            user.getWalletBalance().add(order.getTotalAmount())
        );

        userRepository.save(user);

        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    // GET ORDER BY ID WITH CACHE (TTL 60s in config)
    @Cacheable(value = "orders", key = "#id")
    public OrderDTO getOrder(Long id) {

        Order o = orderRepository.findById(id).orElseThrow(() -> new OrderNotFoundException("Order not found with id " + id));               

        return new OrderDTO(
                o.getId(),
                o.getUser().getId(),
                o.getMarket().getId(),
                o.getOrderType(),
                o.getQuantity(),
                o.getPricePerUnit(),
                o.getTotalAmount(),
                o.getStatus()
        );
    }

    // UPDATE STATUS
    @CachePut(value = "orders", key = "#id")
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new OrderNotFoundException("Order not found with id " + id));

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    //  DELETE ORDER
    @CacheEvict(value = "orders", key = "#id")
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // OTHER QUERIES
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // get order by user Id
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    // get orders by users
    public List<Order> getOrdersByUsers() {
        return orderRepository.findAllWithUserAndMarket();
    }
    // get orders by market Id
    public List<Order> getOrdersByMarketId(Long marketId) {
        return orderRepository.findByMarketId(marketId);
    }
}