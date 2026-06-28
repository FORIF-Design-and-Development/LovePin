package com.hanyang.lovepin.tag.application;

import com.hanyang.lovepin.tag.domain.Tag;
import com.hanyang.lovepin.tag.domain.TagName;
import com.hanyang.lovepin.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional
    public Tag createTag(TagName tagName) {
        tagRepository.findByTagName(tagName)
                .ifPresent(t -> {
                    throw new IllegalArgumentException("이미 존재하는 태그입니다: " + tagName);
                });

        // 엔티티의 ID와 createdAt은 JPA 및 초기화 식에 의해 자동 생성되므로 생성자에는 null과 현재값 위주로 바인딩
        Tag newTag = new Tag(null, tagName, java.time.LocalDateTime.now());
        return tagRepository.save(newTag);
    }

    @Transactional(readOnly = true)
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tag getTagByName(TagName tagName) {
        return tagRepository.findByTagName(tagName)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그입니다: " + tagName));
    }
}
