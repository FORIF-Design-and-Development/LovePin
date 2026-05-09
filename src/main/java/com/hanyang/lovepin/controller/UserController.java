package com.hanyang.lovepin.controller;

import com.hanyang.lovepin.member.User;
import com.hanyang.lovepin.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // JSON 형태의 데이터를 반환하는 REST API용 컨트롤러로 지정합니다.
@RequestMapping("/api/users") // 이 클래스 내의 모든 API 경로는 /api/users로 시작합니다.
public class UserController {

    private final UserService userService;

    // 생성자 주입: 서비스 계층을 컨트롤러에서 사용할 수 있게 연결합니다.
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 사용자 목록 조회 API
     * 경로: GET http://localhost:8080/api/users
     */
    @GetMapping // HTTP GET 요청을 처리하는 메소드임을 명시합니다.
    public List<User> getAllUsers() {
        return userService.findUsers();
    }
}