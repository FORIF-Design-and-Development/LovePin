package com.hanyang.lovepin.auth.presentation;

import com.hanyang.lovepin.auth.application.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.login(body.get("email"), body.get("password")));
    }
}
