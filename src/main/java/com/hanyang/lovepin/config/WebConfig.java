package com.hanyang.lovepin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 여기에 허용할 도메인들을 직접 배열 형태로 적습니다.
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

// Authorization 헤더 및 Content-Type 등 모든 헤더 허용
// 인증 정보(쿠키, Authorization 헤더 등) 포함 허용
// 프리플라이트(Preflight) 요청에 대한 응답 시간 설정 (1시간)