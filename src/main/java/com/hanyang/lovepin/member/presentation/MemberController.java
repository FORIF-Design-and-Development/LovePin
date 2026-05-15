package com.hanyang.lovepin.member.presentation;

import com.hanyang.lovepin.member.application.MemberService;
import com.hanyang.lovepin.member.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 1. 서버 동작 확인을 위한 Health Check API
    // GET http://lovepin-api.ap-northeast-2.elasticbeanstalk.com/api/members/health
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Member 도메인 서비스가 정상적으로 동작 중입니다.");
    }

    // 2. 전체 회원 목록 조회 API (JSON 반환)
    // GET http://lovepin-api.ap-northeast-2.elasticbeanstalk.com/api/members
    @GetMapping
    public ResponseEntity<List<User>> getAllMembers() {
        return ResponseEntity.ok(memberService.findAllMembers());
    }

    // 3. 특정 회원 상세 조회 API
    @GetMapping("/{id}")
    public ResponseEntity<User> getMember(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.findMemberById(id));
    }
}