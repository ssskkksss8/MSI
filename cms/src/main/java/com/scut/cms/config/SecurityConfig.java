package com.scut.cms.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import com.scut.cms.service.JwtUserDetailsService;
import com.scut.cms.security.JwtRequestFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      // 0) Отключаем CSRF, чтобы Postman мог шлёпать POST без токена
      .csrf().disable()

      // 1) Без сессий
      .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()

      // 2) Открываем полностью /auth/**
      .authorizeHttpRequests()
        .requestMatchers("/auth/**").permitAll()

        // 3) Временный допуск POST для наполнения справочников через Postman
        .requestMatchers(HttpMethod.POST,
             "/api/students/**",
             "/api/teachers/**",
             "/api/courses/**",
             "/api/course-offerings/**"
        ).permitAll()

        // 4) Остальные правила (GET/PUT по ролям и т.д.)
        .requestMatchers(HttpMethod.GET, "/api/students/**")
          .hasAnyAuthority("ROLE_STUDENT","ROLE_TEACHER","ROLE_ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/course-choosings/*/score")
          .hasAuthority("ROLE_TEACHER")
        .requestMatchers("/api/**").hasAuthority("ROLE_ADMIN")
        .anyRequest().authenticated()
      .and()

      // 5) JWT-фильтр после всех правил
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS");
    }
}
