package com.hanyang.lovepin.record.domain;

import com.hanyang.lovepin.couple.domain.Couple;
import com.hanyang.lovepin.member.domain.User;
import com.hanyang.lovepin.place.domain.Place;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "record")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id")
    private Couple couple;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Enumerated(EnumType.STRING)
    @Column(name = "record_type", nullable = false)
    private RecordType recordType;

    @Column(length = 30, nullable = false)
    private String title;

    @Column(length = 500)
    private String content;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public enum RecordType {
        INDIVIDUAL, COUPLE
    }

    private Record(User author, Couple couple, Place place, RecordType recordType,
                   String title, String content, LocalDate visitDate) {
        this.author = author;
        this.couple = couple;
        this.place = place;
        this.recordType = recordType;
        this.title = title;
        this.content = content;
        this.visitDate = visitDate;
    }

    public static Record create(User author, Place place, RecordType recordType,
                                String title, String content, LocalDate visitDate) {
        return new Record(author, null, place, recordType, title, content, visitDate);
    }
}
