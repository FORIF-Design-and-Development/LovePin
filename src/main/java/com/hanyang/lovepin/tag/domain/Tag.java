package com.hanyang.lovepin.tag.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tag", uniqueConstraints = {
        @UniqueConstraint(name = "uq_tag_name", columnNames = "tag_name")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long tagId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tag_name", nullable = false, length = 10)
    private TagName tagName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TagName {
        일상, 여행, 데이트
    }
}
