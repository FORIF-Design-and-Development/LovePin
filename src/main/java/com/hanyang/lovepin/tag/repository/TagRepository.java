package com.hanyang.lovepin.tag.repository;

import com.hanyang.lovepin.tag.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
Optional<Tag> findByTagName(Tag.TagName tagName);
}