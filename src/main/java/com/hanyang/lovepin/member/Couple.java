package com.hanyang.lovepin.member;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "couple", uniqueConstraints = {
        @UniqueConstraint(name = "uq_couple_users", columnNames = {"user1_id", "user2_id"}) // [cite: 50]
})
public class Couple {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "couple_id")
    private Long coupleId; // [cite: 36, 41]

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1; // 연결된 사용자 1 [cite: 36, 42]

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2; // 연결된 사용자 2 [cite: 36, 43]

    @Column(name = "d_day_date")
    private LocalDate dDayDate; // 연애 시작일 [cite: 36, 44]

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoupleStatus status = CoupleStatus.ACTIVE; // 상태 (ACTIVE, INACTIVE) [cite: 39, 45]

    @Column(name = "ended_at")
    private LocalDateTime endedAt; // 연결 해제 일시 [cite: 39, 46, 59]

    @Column(name = "ended_reason", length = 20)
    private String endedReason; // 연결 해제 사유 [cite: 39, 45, 60]

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // [cite: 39, 47]

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // [cite: 39, 48]

    protected Couple() {}
}

// 상태 관리를 위한 Enum (별도 파일로 빼셔도 좋습니다)
enum CoupleStatus {
    ACTIVE, INACTIVE
}