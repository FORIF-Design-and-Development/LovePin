package com.hanyang.lovepin.couple.application;

import com.hanyang.lovepin.couple.domain.Couple;
import com.hanyang.lovepin.couple.domain.CoupleRequest;
import com.hanyang.lovepin.couple.repository.CoupleRepository;
import com.hanyang.lovepin.couple.repository.CoupleRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CoupleService {

    private final CoupleRepository coupleRepository;
    private final CoupleRequestRepository coupleRequestRepository;

    @Transactional(readOnly = true)
    public Couple getMyCouple(Long userId) {
        return coupleRepository.findActiveByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("연결된 커플이 없습니다."));
    }

    @Transactional(readOnly = true)
    public List<CoupleRequest> getReceivedRequests(Long userId) {
        return coupleRequestRepository.findByReceiver_UserIdAndStatus(userId, CoupleRequest.Status.PENDING);
    }

    @Transactional(readOnly = true)
    public List<CoupleRequest> getSentRequests(Long userId) {
        return coupleRequestRepository.findBySender_UserIdAndStatus(userId, CoupleRequest.Status.PENDING);
    }
}
