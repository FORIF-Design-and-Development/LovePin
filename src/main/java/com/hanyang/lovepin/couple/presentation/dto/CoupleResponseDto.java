package com.hanyang.lovepin.couple.presentation.dto;

import com.hanyang.lovepin.couple.domain.Couple;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class CoupleResponseDto {
    private Long coupleId;
    private Long user1Id;
    private Long user2Id;
    private LocalDate dDayDate;
    private String status;
    private LocalDateTime createdAt;

    public CoupleResponseDto(Couple couple) {
        this.coupleId = couple.getCoupleId();
        this.user1Id = couple.getUser1().getUserId();
        this.user2Id = couple.getUser2().getUserId();
        this.dDayDate = couple.getDDayDate();
        this.status = couple.getStatus().name();
        this.createdAt = couple.getCreatedAt();
    }
}