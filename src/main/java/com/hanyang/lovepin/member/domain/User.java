package com.hanyang.lovepin.member.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
// Soft Delete 설정: 삭제 시 deleted_at 컬럼에 현재 시간 기록 [cite: 239, 263]
@SQLDelete(sql = "UPDATE user SET deleted_at = NOW() WHERE user_id = ?")
// 조회 시 탈퇴 처리되지 않은(deleted_at이 null인) 데이터만 가져옴 [cite: 263]
@Where(clause = "deleted_at IS NULL")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId; // 사용자 고유 ID [cite: 239, 252]

    @Column(nullable = false, length = 255)
    private String email; // 이메일 (로그인 ID) [cite: 239, 253]

    @Column(length = 255)
    private String password; // 비밀번호 (간편로그인은 Null) [cite: 239, 254]

    @Column(nullable = false, length = 50)
    private String nickname; // 프로필 표시용 닉네임 [cite: 239, 255]

    @Column(name = "unique_code", nullable = false, length = 20)
    private String uniqueCode; // 매칭 요청용 고유 코드 [cite: 239, 256]

    @Column(nullable = false, length = 20)
    private String provider; // 로그인 제공자 (LOCAL, KAKAO 등) [cite: 239, 257]

    @Column(name = "kakao_id")
    private Long kakaoId; // 카카오 고유 ID [cite: 239, 258]

    @Column(name = "profile_img_url", length = 500)
    private String profileImgUrl; // 프로필 사진 URL [cite: 239, 259]

    @Column(name = "push_enabled", nullable = false)
    @ColumnDefault("1")
    private Integer pushEnabled; // 알림 수신 여부 (1: 수신, 0: 거부) [cite: 239, 260]

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 가입일 [cite: 239, 261]

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 정보 변경 시점 [cite: 239, 262]

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 계정 삭제일 [cite: 239, 263]

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.pushEnabled == null) {
            this.pushEnabled = 1;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}