package com.hanyang.lovepin.record.repository;

import com.hanyang.lovepin.record.domain.RecordTagMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecordTagMapRepository extends JpaRepository<RecordTagMap, Long> {
    List<RecordTagMap> findByRecord_RecordId(Long recordId);
}
