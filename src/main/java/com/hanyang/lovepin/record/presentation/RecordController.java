package com.hanyang.lovepin.record.presentation;

import com.hanyang.lovepin.record.domain.Record;
import com.hanyang.lovepin.record.application.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    // 기록 단건 조회
    @GetMapping("/{recordId}")
    public ResponseEntity<Record> getRecord(@PathVariable Long recordId) {
        return ResponseEntity.ok(recordService.getRecord(recordId));
    }

    // 작성자 기준 기록 목록 조회
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Record>> getRecordsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(recordService.getRecordsByAuthor(authorId));
    }
}