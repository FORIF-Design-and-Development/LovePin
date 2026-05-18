package com.hanyang.lovepin.couple.domain;

import com.hanyang.lovepin.member.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "couple", uniqueConstraints = {
        @UniqueConstraint(name = "uq_couple_users", columnNames = {"user1_id", "user2_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Couple {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "couple_id")
    private Long coupleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "d_day_date")
    private LocalDate dDayDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "ended_reason")
    private EndedReason endedReason;

    public enum Status {
        ACTIVE, INACTIVE
    }

    public enum EndedReason {
        MANUAL_DISCONNECT, ACCOUNT_DELETED
    }
}
