package com.hanyang.lovepin.record.domain;

import com.hanyang.lovepin.tag.domain.Tag;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "record_tag_map", uniqueConstraints = {
        @UniqueConstraint(name = "uq_record_tag", columnNames = {"record_id", "tag_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecordTagMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "map_id")
    private Long mapId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private Record record;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;
}
