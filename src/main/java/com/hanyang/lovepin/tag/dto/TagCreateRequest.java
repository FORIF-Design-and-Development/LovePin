package com.hanyang.lovepin.tag.dto;

import com.hanyang.lovepin.tag.domain.TagName;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TagCreateRequest {
    private TagName tagName;
}