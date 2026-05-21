package com.hanyang.lovepin.auth.domain;

import com.hanyang.lovepin.member.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_token", uniqueConstraints = {
        @UniqueConstraint(name = "uq_rt_token", columnNames = "token")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long tokenId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 512)
    private String token;

    @Column(name = "device_id", length = 200)
    private String deviceId;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public static RefreshToken create(User user, String token, LocalDateTime expiresAt) {
        RefreshToken rt = new RefreshToken();
        rt.user = user;
        rt.token = token;
        rt.expiresAt = expiresAt;
        return rt;
    }
}
