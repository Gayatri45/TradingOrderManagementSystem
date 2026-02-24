// package com.markets.Test;

// import org.springframework.beans.factory.annotation.Autowired;

// import com.markets.config.RedisTestBase;
// import com.markets.entity.Order;
// import com.markets.repository.OrderRepository;
// import com.markets.service.OrderService;

// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.context.Test;

// @SpringBootTest
// class OrderCacheTest extends RedisTestBase {

//     @Autowired
//     private OrderService orderService;

//     @Autowired
//     private OrderRepository orderRepository;

//     @Test
//     void shouldCacheOrderById() {

//         Order order = orderRepository.save(new Order(...));

//         // First call → DB
//         OrderDTO first = orderService.getOrder(order.getId());

//         // Delete from DB
//         orderRepository.deleteById(order.getId());

//         // Second call → Should come from Redis
//         OrderDTO second = orderService.getOrder(order.getId());

//         assertNotNull(second);
//         assertEquals(order.getId(), second.getId());
//     }
// }