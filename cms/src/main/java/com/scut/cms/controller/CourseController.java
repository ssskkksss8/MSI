package com.scut.cms.controller;

import com.scut.cms.model.Course;
import com.scut.cms.model.Teacher;
import com.scut.cms.repository.CourseRepository;
import com.scut.cms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    @Autowired
    public CourseController(CourseRepository courseRepository, TeacherRepository teacherRepository) {
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
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
        if (course.getTeacher() != null && course.getTeacher().getId() != null) {
            Teacher teacher = teacherRepository.findById(course.getTeacher().getId())
                    .orElseThrow(() -> new RuntimeException("Teacher with this ID not found: " + course.getTeacher().getId()));
            course.setTeacher(teacher);
        }
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable String id, @RequestBody Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            course.setName(updatedCourse.getName());
            course.setCredit(updatedCourse.getCredit());
            course.setGrade(updatedCourse.getGrade());
            course.setCanceledYear(updatedCourse.getCanceledYear());

            if (updatedCourse.getTeacher() != null && updatedCourse.getTeacher().getId() != null) {
                Teacher teacher = teacherRepository.findById(updatedCourse.getTeacher().getId())
                        .orElseThrow(() -> new RuntimeException("Teacher with this ID not found: " + updatedCourse.getTeacher().getId()));
                course.setTeacher(teacher);
            }

            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course with this ID not found: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable String id) {
        courseRepository.deleteById(id);
    }
}
