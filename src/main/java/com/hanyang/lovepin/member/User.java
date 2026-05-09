package com.hanyang.lovepin.member;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users") // user는 데이터베이스 예약어일 수 있어서 통상적으로 users를 사용합니다.
@Getter // [Annotation] 클래스 내 모든 필드의 Getter 메서드를 자동으로 생성해줍니다.
@NoArgsConstructor(access = AccessLevel.PROTECTED) // [Annotation] JPA 사용을 위한 기본 생성자를 자동으로 만들어줍니다.
public class User {

    @Id // PK(기본키) 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column // 기본적으로 nullable = true 입니다.
    private String password;

    @Column(length = 50, nullable = false)
    private String nickname;

    @Column(name = "unique_code", length = 20, nullable = false, unique = true)
    private String uniqueCode;

    @Column(length = 20, nullable = false)
    private String provider;

    @Column(name = "kakao_id", unique = true)
    private Long kakaoId;

    @Column(name = "profile_img_url", length = 500)
    private String profileImgUrl;

    @Column(name = "push_enabled", nullable = false)
    private Boolean pushEnabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // JPA는 기본 생성자가 반드시 필요합니다.
    // protected User() {}

}