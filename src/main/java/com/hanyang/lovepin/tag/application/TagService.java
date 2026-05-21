package com.hanyang.lovepin.tag.application;

import com.hanyang.lovepin.tag.domain.Tag;
import com.hanyang.lovepin.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tag getTagByName(Tag.TagName tagName) {
        return tagRepository.findByTagName(tagName)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그입니다: " + tagName));
    }
}
