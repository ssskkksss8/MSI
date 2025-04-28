package com.scut.cms.controller;

import com.scut.cms.model.Course;
import com.scut.cms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course with this ID not found: " + id));
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable String id, @RequestBody Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            course.setName(updatedCourse.getName());
            course.setCredit(updatedCourse.getCredit());
            course.setGrade(updatedCourse.getGrade());
            course.setCanceledYear(updatedCourse.getCanceledYear());
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course with this ID not found: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable String id) {
        courseRepository.deleteById(id);
    }
}
