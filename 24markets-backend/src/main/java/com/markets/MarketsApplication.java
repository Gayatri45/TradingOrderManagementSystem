package com.markets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MarketsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketsApplication.class, args);
    }
}