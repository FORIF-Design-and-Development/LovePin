package com.hanyang.lovepin.place.presentation;

import com.hanyang.lovepin.place.application.PlaceService;
import com.hanyang.lovepin.place.domain.Place;
import com.hanyang.lovepin.place.presentation.dto.PlaceRequestDto;
import com.hanyang.lovepin.place.presentation.dto.PlaceResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<PlaceResponseDto> findOrCreate(@RequestBody PlaceRequestDto request) {
        Place place = placeService.findOrCreate(
                request.getKakaoPlaceId(),
                request.getPlaceName(),
                request.getAddress(),
                request.getLatitude(),
                request.getLongitude(),
                request.getCity(),
                request.getDistrict()
        );
        return ResponseEntity.ok(new PlaceResponseDto(place));
    }
}