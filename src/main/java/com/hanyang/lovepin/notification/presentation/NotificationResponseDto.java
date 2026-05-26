package com.hanyang.lovepin.notification.presentation;

import com.hanyang.lovepin.notification.domain.Notification;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class NotificationResponseDto {
    private Long notificationId;
    private String type;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponseDto(Notification notification) {
        this.notificationId = notification.getNotificationId();
        this.type = notification.getType().name();
        this.message = notification.getMessage();
        this.isRead = notification.getIsRead();
        this.createdAt = notification.getCreatedAt();
    }
}