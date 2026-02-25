package com.markets.controller;

import com.markets.entity.Order;
import com.markets.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/createOrder")
    public ResponseEntity<Order> createOrder(@RequestBody Order order,
                                            @RequestAttribute("userId") Long authenticatedUserId) {

        System.out.println("Authenticated userId: " + authenticatedUserId);
        System.out.println("Order userId: " + order.getUser().getId());
        // Ensure user can only create orders for themselves
        if (!order.getUser().getId().equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId,
                                                         @RequestAttribute("userId") Long authenticatedUserId) {
        if (!userId.equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getOrdersByUsers() {        
        return ResponseEntity.ok(orderService.getOrdersByUsers());
    }

    @GetMapping("/getRecentsOrders")
    public ResponseEntity<List<Order>> getRecentOrders() {        
        return ResponseEntity.ok(orderService.getRecentOrders());
    }

    @GetMapping("/market/{marketId}")
    public ResponseEntity<List<Order>> getOrdersByMarketId(@PathVariable Long marketId) {
        return ResponseEntity.ok(orderService.getOrdersByMarketId(marketId));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        System.out.println(status);
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id,
                                           @RequestAttribute("userId") Long authenticatedUserId) {
        var order = orderService.getOrderById(id);
        if (order.isPresent() && order.get().getUser().getId().equals(authenticatedUserId)) {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
