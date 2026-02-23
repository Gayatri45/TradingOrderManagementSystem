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

    @PostMapping("/createMarket")
    public ResponseEntity<Market> createMarket(@RequestBody Market market) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marketService.createMarket(market));
    }

    @GetMapping("/getAllMarkets")
    public ResponseEntity<List<Market>> getAllMarkets() {
        return ResponseEntity.ok(marketService.getAllMarkets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Market> getMarketById(@PathVariable Long id) {
        return marketService.getMarketById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<Market> getMarketBySymbol(@PathVariable String symbol) {
        return marketService.getMarketBySymbol(symbol)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Market> updateMarket(@PathVariable Long id, @RequestBody Market market) {
        return ResponseEntity.ok(marketService.updateMarket(id, market));
    }
}