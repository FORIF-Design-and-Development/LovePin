package com.hanyang.lovepin.auth.application;

import com.hanyang.lovepin.auth.JwtUtil;
import com.hanyang.lovepin.auth.domain.RefreshToken;
import com.hanyang.lovepin.auth.repository.RefreshTokenRepository;
import com.hanyang.lovepin.member.domain.User;
import com.hanyang.lovepin.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // 로그인
    @Transactional
    public Map<String, String> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getUserId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId());

        RefreshToken rt = RefreshToken.create(user, refreshToken,
                LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(rt);

        return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
    }
}