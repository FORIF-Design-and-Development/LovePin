package com.hanyang.lovepin.place.presentation.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class PlaceRequestDto {
    private String kakaoPlaceId;
    private String placeName;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String city;
    private String district;
}