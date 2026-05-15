package com.hanyang.lovepin.member.repository;

import com.hanyang.lovepin.member.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 이메일로 사용자 찾기 (로그인 시 필요)
    Optional<User> findByEmail(String email);

    // 고유 코드로 사용자 찾기 (커플 매칭 시 필요)
    Optional<User> findByUniqueCode(String uniqueCode);
}