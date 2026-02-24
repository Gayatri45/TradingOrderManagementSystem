package com.markets.service;

import com.markets.entity.Order;
import com.markets.entity.User;
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

    // ============================================================
    // ✅ CREATE ORDER
    // ============================================================
    @CacheEvict(value = "orders", allEntries = true)
    @Transactional
    public Order createOrder(Order orderRequest) {

        User user = userRepository.findById(orderRequest.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Market market = marketRepository.findById(orderRequest.getMarket().getId())
                .orElseThrow(() -> new RuntimeException("Market not found"));

        double total = orderRequest.getQuantity() * orderRequest.getPricePerUnit();

        if ("BUY".equalsIgnoreCase(orderRequest.getOrderType())) {

            if (user.getWalletBalance() < total)
                throw new RuntimeException("Insufficient wallet balance");

            user.setWalletBalance(user.getWalletBalance() - total);

        } else if ("SELL".equalsIgnoreCase(orderRequest.getOrderType())) {

            user.setWalletBalance(user.getWalletBalance() + total);

        } else {
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

        // 1️⃣ Increment user order counter
        redis.opsForValue().increment(
                String.format(USER_ORDER_COUNT, user.getId())
        );

        // 2️⃣ Add to global recent orders list
        redis.opsForList().leftPush(RECENT_ORDERS, savedOrder.getId().toString());
        redis.opsForList().trim(RECENT_ORDERS, 0, 9); // keep last 10

        return savedOrder;
    }

    // ============================================================
    // ✅ GET ORDER COUNT
    // ============================================================
    public Long getUserOrderCount(Long userId) {
        String value = redis.opsForValue()
                .get(String.format(USER_ORDER_COUNT, userId));

        return value != null ? Long.parseLong(value) : 0L;
    }

    // ============================================================
    // ✅ GET RECENT ORDERS
    // ============================================================
    public List<Order> getRecentOrders() {

        List<String> ids = redis.opsForList()
                .range(RECENT_ORDERS, 0, 9);

        if (ids == null || ids.isEmpty()) return List.of();

        List<Long> orderIds = ids.stream()
                .map(Long::valueOf)
                .collect(Collectors.toList());

        return orderRepository.findAllById(orderIds);
    }

    // ============================================================
    // ✅ CANCEL ORDER
    // ============================================================
    @CacheEvict(value = "orders", key = "#orderId")
    @Transactional
    public void cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("CANCELLED".equals(order.getStatus()))
            return;

        User user = order.getUser();
        user.setWalletBalance(user.getWalletBalance() + order.getTotalAmount());

        userRepository.save(user);

        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    // ============================================================
    // ✅ GET ORDER BY ID WITH CACHE (TTL 60s in config)
    // ============================================================
    @Cacheable(value = "orders", key = "#id")
    public OrderDTO getOrder(Long id) {

        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

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

    // ============================================================
    // ✅ UPDATE STATUS
    // ============================================================
    @CachePut(value = "orders", key = "#id")
    public Order updateOrderStatus(Long id, String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    // ============================================================
    // ✅ DELETE ORDER
    // ============================================================
    @CacheEvict(value = "orders", key = "#id")
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // ============================================================
    // ✅ OTHER QUERIES
    // ============================================================
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByMarketId(Long marketId) {
        return orderRepository.findByMarketId(marketId);
    }
}

// package com.markets.service;

// import com.markets.entity.Order;
// import com.markets.entity.User;
// import com.markets.dto.OrderDTO;
// import com.markets.entity.Market;
// import com.markets.repository.OrderRepository;
// import com.markets.repository.UserRepository;

// import jakarta.transaction.Transactional;

// import com.markets.repository.MarketRepository;
// import lombok.RequiredArgsConstructor;

// import org.springframework.cache.annotation.CacheEvict;
// import org.springframework.cache.annotation.CachePut;
// import org.springframework.cache.annotation.Cacheable;
// import org.springframework.data.redis.core.RedisTemplate;
// import org.springframework.data.redis.core.StringRedisTemplate;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;

// @Service
// @RequiredArgsConstructor
// public class OrderService {

//     private final OrderRepository orderRepository;
//     private final UserRepository userRepository;
//     private final MarketRepository marketRepository;
//     private final StringRedisTemplate redis;
//     private final RedisTemplate<String, Object> redisTemplate;

//     @CacheEvict(value = "orders", allEntries = true) // clear orders cache
//     @Transactional
//     public Order createOrder(Order orderRequest) {

//         // ✅ Fetch managed User from DB
//         User user = userRepository.findById(orderRequest.getUser().getId())
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         // ✅ Fetch managed Market from DB
//         Market market = marketRepository.findById(orderRequest.getMarket().getId())
//                 .orElseThrow(() -> new RuntimeException("Market not found"));

//         // ✅ Calculate total amount
//         double total = orderRequest.getQuantity() * orderRequest.getPricePerUnit();

//         // ✅ Handle BUY / SELL
//         if ("BUY".equalsIgnoreCase(orderRequest.getOrderType())) {

//             if (user.getWalletBalance() < total) {
//                 throw new RuntimeException("Insufficient wallet balance");
//             }

//             user.setWalletBalance(user.getWalletBalance() - total);

//         } else if ("SELL".equalsIgnoreCase(orderRequest.getOrderType())) {

//             user.setWalletBalance(user.getWalletBalance() + total);

//         } else {
//             throw new RuntimeException("Invalid order type");
//         }

//         // ✅ Save User (managed, version handled by Hibernate)
//         user = userRepository.save(user);

//         // ✅ Create Order with managed entities
//         Order order = new Order();
//         order.setUser(user);
//         order.setMarket(market);
//         order.setOrderType(orderRequest.getOrderType());
//         order.setQuantity(orderRequest.getQuantity());
//         order.setPricePerUnit(orderRequest.getPricePerUnit());
//         order.setTotalAmount(total);
//         order.setStatus("PENDING");
//         order.setCreatedAt(LocalDateTime.now());
//         order.setUpdatedAt(LocalDateTime.now());

//         // ✅ Save Order
//         Order savedOrder = orderRepository.save(order);

//         // ✅ Update Redis caches
//         redis.opsForValue().increment("user:orders:" + user.getId());
//         String key = "recent:orders:" + user.getId();
//         redis.opsForList().leftPush(key, savedOrder.getId().toString());
//         redis.opsForList().trim(key, 0, 9);
//         redisTemplate.opsForValue().increment(key);
//         return savedOrder;
//     }

//     public Long getUserOrderCount(Long userId) {
//         String key = "user:" + userId + ":orderCount";
//         Object value = redisTemplate.opsForValue().get(key);
//         return value != null ? Long.parseLong(value.toString()) : 0L;
//     }

//     public List<Order> getRecentOrders() {
//         List<Object> ids = redisTemplate.opsForList()
//                 .range("recent:orders", 0, 9);
//         if (ids == null) return List.of();
//         List<Long> orderIds = ids.stream()
//                 .map(id -> Long.parseLong(id.toString()))
//                 .toList();
//         return orderRepository.findAllById(orderIds);
//     }

//     @CacheEvict(value = "orders", key = "#orderId")
//     @Transactional
//     public void cancelOrder(Long orderId) {
//         Order order = orderRepository.findById(orderId).orElseThrow();

//         User user = order.getUser();
//         user.setWalletBalance(user.getWalletBalance() + order.getTotalAmount());
//         userRepository.save(user);

//         order.setStatus("CANCELLED");
//         orderRepository.save(order);
//     }

//     public Optional<Order> getOrderById(Long id) {
//         return orderRepository.findById(id);
//     }

//     public List<Order> getOrdersByUserId(Long userId) {
//         return orderRepository.findByUserId(userId);
//     }

//     public List<Order> getOrdersByMarketId(Long marketId) {
//         return orderRepository.findByMarketId(marketId);
//     }

//     @CachePut(value = "orders", key = "#order.id")
//     public Order updateOrderStatus(Long id, String status) {
//         return orderRepository.findById(id).map(order -> {
//             order.setStatus(status);
//             order.setUpdatedAt(LocalDateTime.now());
//             return orderRepository.save(order);
//         }).orElseThrow(() -> new RuntimeException("Order not found"));
//     }

//     @CacheEvict(value = "orders", key = "#id")
//     public void deleteOrder(Long id) {
//         orderRepository.deleteById(id);
//     }

//     @Cacheable(value = "orders", key = "#id")
//     public OrderDTO getOrder(Long id) {

//         Order o = orderRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Order not found"));

//         return new OrderDTO(
//                 o.getId(),
//                 o.getUser().getId(),
//                 o.getMarket().getId(),
//                 o.getOrderType(),
//                 o.getQuantity(),
//                 o.getPricePerUnit(),
//                 o.getTotalAmount(),
//                 o.getStatus()
//         );
//     }
// }



//     // @Transactional
//     // public Order createOrder(Order order) {

//     //     User user = userRepository.findById(order.getUser().getId())
//     //             .orElseThrow(() -> new RuntimeException("User not found"));

//     //     Market market = marketRepository.findById(order.getMarket().getId())
//     //             .orElseThrow(() -> new RuntimeException("Market not found"));

//     //     double total = order.getQuantity() * order.getPricePerUnit();

//     //     // ✅ Check wallet balance
//     //     if (user.getWalletBalance() < total) {
//     //         throw new RuntimeException("Insufficient wallet balance");
//     //     }

//     //     // ✅ Debit wallet
//     //     user.setWalletBalance(user.getWalletBalance() - total);
//     //     userRepository.save(user);

//     //     // ✅ Order details
//     //     order.setTotalAmount(total);
//     //     order.setCreatedAt(LocalDateTime.now());
//     //     order.setUpdatedAt(LocalDateTime.now());
//     //     order.setStatus("PENDING");

//     //     Order savedOrder = orderRepository.save(order);

//     //     // ✅ Redis user order counter
//     //     redis.opsForValue().increment("user:orders:" + user.getId());

//     //     // ✅ Redis recent orders list
//     //     String key = "recent:orders:" + user.getId();
//     //     redis.opsForList().leftPush(key, savedOrder.getId().toString());
//     //     redis.opsForList().trim(key, 0, 9);

//     //     return savedOrder;
//     // }

//     // public Order createOrder(Order order) {
//     //     User user = userRepository.findById(order.getUser().getId())
//     //             .orElseThrow(() -> new RuntimeException("User not found"));
//     //     Market market = marketRepository.findById(order.getMarket().getId())
//     //             .orElseThrow(() -> new RuntimeException("Market not found"));

//     //     // Calculate total amount
//     //     order.setTotalAmount(order.getQuantity() * order.getPricePerUnit());
//     //     order.setCreatedAt(LocalDateTime.now());
//     //     order.setUpdatedAt(LocalDateTime.now());
//     //     order.setStatus("PENDING");

//     //     return orderRepository.save(order);
//     // }
