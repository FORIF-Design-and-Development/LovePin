package com.hanyang.lovepin.place.presentation.dto;

import com.hanyang.lovepin.place.domain.Place;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
public class PlaceResponseDto {
    private Long placeId;
    private String kakaoPlaceId;
    private String placeName;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String city;
    private String district;

    public PlaceResponseDto(Place place) {
        this.placeId = place.getPlaceId();
        this.kakaoPlaceId = place.getKakaoPlaceId();
        this.placeName = place.getPlaceName();
        this.address = place.getAddress();
        this.latitude = place.getLatitude();
        this.longitude = place.getLongitude();
        this.city = place.getCity();
        this.district = place.getDistrict();
    }
}