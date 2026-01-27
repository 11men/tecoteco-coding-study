package com.busapp.adapter.in.web;

import com.busapp.application.port.in.GetStrikesUseCase;
import com.busapp.domain.Strike;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/strikes")
@CrossOrigin(origins = "*")
public class StrikeController {

    private final GetStrikesUseCase getStrikesUseCase;

    public StrikeController(GetStrikesUseCase getStrikesUseCase) {
        this.getStrikesUseCase = getStrikesUseCase;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllStrikes(
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {

        List<Strike> strikes = activeOnly ?
            getStrikesUseCase.getActiveStrikes() :
            getStrikesUseCase.getAllStrikes();

        return ResponseEntity.ok(Map.of(
            "success", true,
            "total", strikes.size(),
            "strikes", strikes
        ));
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveStrikes() {
        List<Strike> strikes = getStrikesUseCase.getActiveStrikes();

        return ResponseEntity.ok(Map.of(
            "success", true,
            "total", strikes.size(),
            "strikes", strikes
        ));
    }
}
