package com.hanyang.lovepin.notification.controller;

import com.hanyang.lovepin.notification.application.NotificationService;
import com.hanyang.lovepin.notification.domain.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{receiverId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long receiverId) {
        return ResponseEntity.ok(notificationService.getNotifications(receiverId));
    }

    @GetMapping("/{receiverId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long receiverId) {
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(receiverId)));
    }
}
