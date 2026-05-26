package com.hanyang.lovepin.couple.presentation.dto;

import com.hanyang.lovepin.couple.domain.CoupleRequest;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class CoupleRequestResponseDto {
    private Long requestId;
    private Long senderId;
    private Long receiverId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    public CoupleRequestResponseDto(CoupleRequest request) {
        this.requestId = request.getRequestId();
        this.senderId = request.getSender().getUserId();
        this.receiverId = request.getReceiver().getUserId();
        this.status = request.getStatus().name();
        this.createdAt = request.getCreatedAt();
        this.expiresAt = request.getExpiresAt();
    }
}