package com.hanyang.lovepin.record.presentation.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class RecordRequestDto {
    private Long placeId;
    private String recordType;
    private String title;
    private String content;
    private LocalDate visitDate;
    private List<Long> tagIds;
}