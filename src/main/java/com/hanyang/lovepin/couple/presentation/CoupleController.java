package com.hanyang.lovepin.couple.presentation;

import com.hanyang.lovepin.couple.application.CoupleService;
import com.hanyang.lovepin.couple.domain.Couple;
import com.hanyang.lovepin.couple.domain.CoupleRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/couples")
@RequiredArgsConstructor
public class CoupleController {

    private final CoupleService coupleService;

    // 내 커플 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<Couple> getMyCouple(@PathVariable Long userId) {
        return ResponseEntity.ok(coupleService.getMyCouple(userId));
    }

    // 받은 매칭 요청 목록
    @GetMapping("/{userId}/requests/received")
    public ResponseEntity<List<CoupleRequest>> getReceivedRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(coupleService.getReceivedRequests(userId));
    }

    // 보낸 매칭 요청 목록
    @GetMapping("/{userId}/requests/sent")
    public ResponseEntity<List<CoupleRequest>> getSentRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(coupleService.getSentRequests(userId));
    }
}