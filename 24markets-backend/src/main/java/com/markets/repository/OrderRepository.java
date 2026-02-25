package com.markets.repository;

import com.markets.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByMarketId(Long marketId);
    @Query("SELECT o FROM Order o JOIN FETCH o.user JOIN FETCH o.market")
    List<Order> findAllWithUserAndMarket();
}