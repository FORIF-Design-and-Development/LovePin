package com.hanyang.lovepin.record.repository;

import com.hanyang.lovepin.record.domain.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// Record(방문 기록) 엔티티 DB 접근용 레포
@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    // 작성자 userId로 기록 목록을 조회합니다. (타임라인용)
    List<Record> findByAuthor_UserId(Long authorId);

    // author, place를 함께 조회해 JSON 직렬화 시 Lazy Loading 오류를 방지합니다.
    @Query("SELECT r FROM Record r " +
            "JOIN FETCH r.author " +
            "JOIN FETCH r.place " +
            "LEFT JOIN FETCH r.couple " +
            "WHERE r.author.userId = :authorId")
    List<Record> findAllByAuthorIdWithDetails(@Param("authorId") Long authorId);
}
