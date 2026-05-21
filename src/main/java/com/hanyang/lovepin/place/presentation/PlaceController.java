package com.hanyang.lovepin.place.presentation;

import com.hanyang.lovepin.place.application.PlaceService;
import com.hanyang.lovepin.place.domain.Place;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> findOrCreate(@RequestBody Map<String, String> body) {
        Place place = placeService.findOrCreate(
                body.get("kakaoPlaceId"),
                body.get("placeName"),
                body.get("address"),
                new BigDecimal(body.get("latitude")),
                new BigDecimal(body.get("longitude")),
                body.get("city"),
                body.get("district")
        );
        return ResponseEntity.ok(Map.of("placeId", place.getPlaceId()));
    }
}