package com.hanyang.lovepin.couple.repository;

import com.hanyang.lovepin.couple.domain.CoupleRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CoupleRequestRepository extends JpaRepository<CoupleRequest, Long> {

    List<CoupleRequest> findBySender_UserIdAndStatus(Long senderId, CoupleRequest.Status status);
    List<CoupleRequest> findByReceiver_UserIdAndStatus(Long receiverId, CoupleRequest.Status status);
}