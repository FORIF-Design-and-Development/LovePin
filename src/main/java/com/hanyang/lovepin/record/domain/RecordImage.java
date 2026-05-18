package com.hanyang.lovepin.record.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "record_image")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecordImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private Record record;

    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Integer sequence;

    @Column(name = "is_representative", nullable = false)
    private Boolean isRepresentative = false;
}
