// package com.markets.config;

// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.context.DynamicPropertyRegistry;
// import org.springframework.test.context.DynamicPropertySource;

// import org.testcontainers.containers.RedisContainer;
// import org.testcontainers.junit.jupiter.Container;
// import org.testcontainers.junit.jupiter.Testcontainers;

// @Testcontainers
// @SpringBootTest
// public abstract class RedisTestBase {

//     @Container
//     static RedisContainer redis =
//             new RedisContainer("redis:7.2");

//     @DynamicPropertySource
//     static void redisProperties(DynamicPropertyRegistry registry) {
//         registry.add("spring.data.redis.host", redis::getHost);
//         registry.add("spring.data.redis.port", redis::getFirstMappedPort);
//     }
// }
