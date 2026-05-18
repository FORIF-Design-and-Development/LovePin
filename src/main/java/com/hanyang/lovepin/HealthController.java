package com.hanyang.lovepin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<String> rootHealthCheck() {
        return ResponseEntity.ok("lovepin-backend-up");
    }
    /*
    public String health() {
        return "OK";
    }
     */

}