package com.hanyang.lovepin.place.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "place", uniqueConstraints = {
        @UniqueConstraint(name = "uq_place_kakao_id", columnNames = "kakao_place_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "place_id")
    private Long placeId;

    @Column(name = "kakao_place_id", length = 50, nullable = false)
    private String kakaoPlaceId;

    @Column(name = "place_name", length = 100, nullable = false)
    private String placeName;

    @Column(length = 255)
    private String address;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(length = 20, nullable = false)
    private String city;

    @Column(length = 20, nullable = false)
    private String district;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Place(String kakaoPlaceId, String placeName, String address,
                  BigDecimal latitude, BigDecimal longitude, String city, String district) {
        this.kakaoPlaceId = kakaoPlaceId;
        this.placeName = placeName;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.district = district;
    }

    public static Place create(String kakaoPlaceId, String placeName, String address,
                               BigDecimal latitude, BigDecimal longitude, String city, String district) {
        return new Place(kakaoPlaceId, placeName, address, latitude, longitude, city, district);
    }
}
