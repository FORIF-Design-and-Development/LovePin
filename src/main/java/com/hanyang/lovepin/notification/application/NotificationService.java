package com.hanyang.lovepin.notification.application;

import com.hanyang.lovepin.notification.domain.Notification;
import com.hanyang.lovepin.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<Notification> getNotifications(Long receiverId) {
        return notificationRepository.findByReceiver_UserIdOrderByCreatedAtDesc(receiverId);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long receiverId) {
        return notificationRepository.countByReceiver_UserIdAndIsRead(receiverId, false);
    }
}
