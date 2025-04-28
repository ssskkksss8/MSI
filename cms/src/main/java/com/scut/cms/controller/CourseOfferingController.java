package com.scut.cms.controller;

import com.scut.cms.model.Course;
import com.scut.cms.model.CourseOffering;
import com.scut.cms.model.Teacher;
import com.scut.cms.repository.CourseOfferingRepository;
import com.scut.cms.repository.CourseRepository;
import com.scut.cms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.scut.cms.model.CourseOfferingId;

import java.util.List;

@RestController
@RequestMapping("/api/course-offerings")
public class CourseOfferingController {

    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    @Autowired
    public CourseOfferingController(CourseOfferingRepository courseOfferingRepository,
                                     CourseRepository courseRepository,
                                     TeacherRepository teacherRepository) {
        this.courseOfferingRepository = courseOfferingRepository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
    }

    @GetMapping
    public List<CourseOffering> getAllCourseOfferings() {
        return courseOfferingRepository.findAll();
    }

    @PostMapping
    public CourseOffering createCourseOffering(@RequestParam String courseId,
                                                @RequestParam String teacherId,
                                                @RequestParam int year) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));

        CourseOffering offering = new CourseOffering();
        
        // Устанавливаем составной ключ
        CourseOfferingId courseOfferingId = new CourseOfferingId(course, teacher);
        offering.setId(courseOfferingId); // Устанавливаем составной ключ в объект
        
        offering.setYear(year);

        return courseOfferingRepository.save(offering);
    }

    @DeleteMapping("/{id}")
    public void deleteCourseOffering(@PathVariable Long id) {
        courseOfferingRepository.deleteById(id);
    }
}
