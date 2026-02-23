package com.markets.service;

import com.markets.entity.Market;
import com.markets.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketRepository marketRepository;

    @Cacheable(value = "markets")
    public List<Market> getAllMarkets() {
        return marketRepository.findAll();
    }

    @Cacheable(value = "market", key = "#id")
    public Optional<Market> getMarketById(Long id) {
        return marketRepository.findById(id);
    }

    public Optional<Market> getMarketBySymbol(String symbol) {
        return marketRepository.findBySymbol(symbol);
    }

    public Market createMarket(Market market) {
        market.setCreatedAt(LocalDateTime.now());
        market.setUpdatedAt(LocalDateTime.now());
        return marketRepository.save(market);
    }

    public Market updateMarket(Long id, Market marketDetails) {
        return marketRepository.findById(id).map(market -> {
            market.setCurrentPrice(marketDetails.getCurrentPrice());
            market.setOpenPrice(marketDetails.getOpenPrice());
            market.setHighPrice(marketDetails.getHighPrice());
            market.setLowPrice(marketDetails.getLowPrice());
            market.setVolume(marketDetails.getVolume());
            market.setUpdatedAt(LocalDateTime.now());
            return marketRepository.save(market);
        }).orElseThrow(() -> new RuntimeException("Market not found"));
    }
}