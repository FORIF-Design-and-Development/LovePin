package com.hanyang.lovepin.member.application;

import com.hanyang.lovepin.member.domain.User;
import com.hanyang.lovepin.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final UserRepository userRepository;

    // 전체 회원 조회 (테스트용)
    public List<User> findAllMembers() {
        return userRepository.findAll();
    }

    // ID로 특정 회원 조회
    public User findMemberById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다. ID: " + id));
    }
}