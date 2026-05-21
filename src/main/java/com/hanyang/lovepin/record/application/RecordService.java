package com.hanyang.lovepin.record.application;

import com.hanyang.lovepin.member.domain.User;
import com.hanyang.lovepin.place.domain.Place;
import com.hanyang.lovepin.record.domain.Record;
import com.hanyang.lovepin.record.domain.RecordTagMap;
import com.hanyang.lovepin.record.repository.RecordRepository;
import com.hanyang.lovepin.record.repository.RecordTagMapRepository;
import com.hanyang.lovepin.tag.domain.Tag;
import com.hanyang.lovepin.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;
    private final RecordTagMapRepository recordTagMapRepository;
    private final TagRepository tagRepository;

    // 기록 생성
    @Transactional
    public Record createRecord(User author, Place place, Record.RecordType recordType,
                               String title, String content, LocalDate visitDate,
                               List<Long> tagIds) {

        Record record = Record.create(author, place, recordType, title, content, visitDate);
        recordRepository.save(record);

        // 태그 매핑
        for (Long tagId : tagIds) {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그입니다: " + tagId));
            RecordTagMap map = RecordTagMap.create(record, tag);
            recordTagMapRepository.save(map);
        }

        return record;
    }

    // 작성자 기준 기록 목록 조회
    @Transactional(readOnly = true)
    public List<Record> getRecordsByAuthor(Long authorId) {
        return recordRepository.findAllByAuthorIdWithDetails(authorId);
    }

    // 단건 조회
    @Transactional(readOnly = true)
    public Record getRecord(Long recordId) {
        return recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 기록입니다: " + recordId));
    }
}