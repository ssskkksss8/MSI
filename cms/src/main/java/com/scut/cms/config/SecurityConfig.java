package com.scut.cms.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    private final JwtRequestFilter jwtFilter;

    public SecurityConfig(JwtRequestFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()

                // 🔓 Публичные маршруты
                .requestMatchers("/auth/**").permitAll()

                // 🔓 Регистрация студентов, учителей и т.д.
                .requestMatchers(HttpMethod.POST,
                    "/api/students/**",
                    "/api/teachers/**",
                    "/api/courses/**",
                    "/api/course-offerings/**"
                ).permitAll()

                // 🔓 Разрешить регистрацию через специальный маршрут (если есть)
                .requestMatchers(HttpMethod.POST, "/api/register").permitAll()

                // 🔒 Доступ для авторизованных
                .requestMatchers(HttpMethod.GET, "/api/students/**")
                    .hasAnyAuthority("ROLE_STUDENT", "ROLE_TEACHER", "ROLE_ADMIN")

                .requestMatchers(HttpMethod.PUT, "/api/course-choosings/*/score")
                    .hasAuthority("ROLE_TEACHER")

                // 🔒 Всё остальное — только для администратора
                .requestMatchers("/api/**").hasAuthority("ROLE_ADMIN")

                // Любой другой запрос — должен быть авторизован
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
