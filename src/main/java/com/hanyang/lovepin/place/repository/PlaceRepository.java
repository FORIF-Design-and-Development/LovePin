package com.hanyang.lovepin.place.repository;

import com.hanyang.lovepin.place.domain.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Place(방문 장소) 엔티티 DB 접근용 레포지토리입니다.
@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    // 카카오 장소 ID로 조회합니다. 기록 작성 시 같은 장소 중복 저장을 막을 때 씁니다.
    Optional<Place> findByKakaoPlaceId(String kakaoPlaceId);
}
