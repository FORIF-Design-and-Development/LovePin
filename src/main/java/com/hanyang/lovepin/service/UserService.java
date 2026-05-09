package com.hanyang.lovepin.service;

import com.hanyang.lovepin.member.User;
import com.hanyang.lovepin.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service // 스프링이 이 클래스를 비즈니스 로직을 처리하는 서비스 빈으로 관리하게 합니다.
@Transactional // 메소드 실행 중 예외가 발생하면 데이터베이스 작업을 자동으로 롤백(취소)해 줍니다.
public class UserService {

    private final UserRepository userRepository;

    // 생성자 주입: 스프링이 필요한 UserRepository 객체를 자동으로 넣어줍니다.
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 사용자 저장 (회원가입)
     */
    public Long join(User user) {
        userRepository.save(user); // JPA의 save 기능을 이용해 DB에 저장합니다.
        return user.getUserId();
    }

    /**
     * 전체 사용자 조회
     */
    @Transactional(readOnly = true) // 읽기 전용 작업일 때 성능을 최적화합니다.
    public List<User> findUsers() {
        return userRepository.findAll(); // 모든 사용자 리스트를 반환합니다.
    }
}