package com.markets.controller;

import com.markets.entity.Market;
import com.markets.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MarketController {

    private final MarketService marketService;

    // ✅ Create a new market
    @PostMapping("/createMarket")
    public ResponseEntity<Market> createMarket(@RequestBody Market market) {
        Market createdMarket = marketService.createMarket(market);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMarket);
    }

    // ✅ Get all markets (cached)
    @GetMapping("/getAllMarkets")
    public ResponseEntity<List<Market>> getAllMarkets() {
        List<Market> markets = marketService.getAllMarkets();      
        return ResponseEntity.ok(markets);
    }

    // ✅ Get market by ID (cached)
    @GetMapping("/{id}")
    public ResponseEntity<Market> getMarketById(@PathVariable Long id) {
        try {
            Market market = marketService.getMarketById(id);
            return ResponseEntity.ok(market);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Get market by symbol
    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<Market> getMarketBySymbol(@PathVariable String symbol) {
        return marketService.getMarketBySymbol(symbol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update market by ID (evicts cache)
    @PutMapping("/{id}")
    public ResponseEntity<Market> updateMarket(@PathVariable Long id, @RequestBody Market market) {
        try {
            Market updatedMarket = marketService.updateMarket(id, market);
            return ResponseEntity.ok(updatedMarket);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
