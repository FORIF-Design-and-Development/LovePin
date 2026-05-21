package com.hanyang.lovepin.place.application;

import com.hanyang.lovepin.place.domain.Place;
import com.hanyang.lovepin.place.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;

    @Transactional
    public Place findOrCreate(String kakaoPlaceId, String placeName, String address,
                               BigDecimal latitude, BigDecimal longitude,
                               String city, String district) {
        return placeRepository.findByKakaoPlaceId(kakaoPlaceId)
                .orElseGet(() -> placeRepository.save(
                        Place.create(kakaoPlaceId, placeName, address,
                                latitude, longitude, city, district)
                ));
    }
}