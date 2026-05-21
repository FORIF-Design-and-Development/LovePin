package com.hanyang.lovepin.notification.repository;

import com.hanyang.lovepin.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiver_UserIdOrderByCreatedAtDesc(Long receiverId);
    long countByReceiver_UserIdAndIsRead(Long receiverId, Boolean isRead);
}
