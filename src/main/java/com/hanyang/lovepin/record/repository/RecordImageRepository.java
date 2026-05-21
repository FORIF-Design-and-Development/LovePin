package com.hanyang.lovepin.record.repository;

import com.hanyang.lovepin.record.domain.RecordImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordImageRepository extends JpaRepository<RecordImage, Long> {
}
