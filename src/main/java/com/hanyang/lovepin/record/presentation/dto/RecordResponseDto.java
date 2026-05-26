package com.hanyang.lovepin.record.presentation.dto;

import com.hanyang.lovepin.record.domain.Record;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class RecordResponseDto {
    private Long recordId;
    private String title;
    private String content;
    private LocalDate visitDate;
    private String recordType;
    private Long authorId;
    private Long placeId;
    private LocalDateTime createdAt;

    public RecordResponseDto(Record record) {
        this.recordId = record.getRecordId();
        this.title = record.getTitle();
        this.content = record.getContent();
        this.visitDate = record.getVisitDate();
        this.recordType = record.getRecordType().name();
        this.authorId = record.getAuthor().getUserId();
        this.placeId = record.getPlace().getPlaceId();
        this.createdAt = record.getCreatedAt();
    }
}