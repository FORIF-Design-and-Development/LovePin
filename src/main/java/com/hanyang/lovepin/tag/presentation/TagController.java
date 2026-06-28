package com.hanyang.lovepin.tag.presentation;

import com.hanyang.lovepin.tag.domain.Tag;
import com.hanyang.lovepin.tag.application.TagService;
import com.hanyang.lovepin.tag.domain.TagName;
import com.hanyang.lovepin.tag.dto.TagCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    /**
     * [C] 태그 생성 API
     * POST /api/tags
     * Body: { "tagName": "CAFE" }
     */
    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody TagCreateRequest request) {
        Tag savedTag = tagService.createTag(request.getTagName());
        return ResponseEntity.ok(savedTag);
    }

    // 태그 목록 전체 조회
    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    /**
     * [R] 태그 이름 단건 검색 API
     * GET /api/tags/search?name=CAFE
     */
    @GetMapping("/search")
    public ResponseEntity<Tag> getTagByName(@RequestParam TagName name) {
        Tag tag = tagService.getTagByName(name);
        return ResponseEntity.ok(tag);
    }
}