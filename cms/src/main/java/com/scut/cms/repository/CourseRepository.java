package com.scut.cms.repository;

import com.scut.cms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CourseRepository extends JpaRepository<Course, String> {
    Course findByName(String name);
}