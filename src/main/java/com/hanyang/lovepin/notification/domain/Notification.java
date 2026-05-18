package com.hanyang.lovepin.notification.domain;

import com.hanyang.lovepin.couple.domain.Couple;
import com.hanyang.lovepin.couple.presentation.CoupleRequest;
import com.hanyang.lovepin.member.domain.User;
import com.hanyang.lovepin.record.domain.Record;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private CoupleRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id")
    private Record record;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id")
    private Couple couple;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(length = 255, nullable = false)
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        MATCH_REQUEST,
        MATCH_ACCEPTED,
        MATCH_REJECTED,
        MATCH_EXPIRED,
        LINK_DISCONNECTED,
        ACCOUNT_DELETED,
        COUPLE_RECORD_CREATED,
        COUPLE_RECORD_UPDATED,
        COUPLE_RECORD_DELETED,
        DDAY_UPDATED
    }
}
