package com.hanyang.lovepin.repository;

import com.hanyang.lovepin.member.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 이메일로 사용자를 찾는 기능을 추가할 수 있습니다.
    Optional<User> findByEmail(String email);

    // 유니크 코드로 사용자를 찾는 기능도 나중에 매칭할 때 필요합니다. [cite: 4, 12]
    Optional<User> findByUniqueCode(String uniqueCode);
}