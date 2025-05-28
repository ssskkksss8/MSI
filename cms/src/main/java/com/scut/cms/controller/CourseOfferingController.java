package com.scut.cms.controller;

import com.scut.cms.model.*;
import com.scut.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/teacher/{teacherId}")
    public List<CourseOffering> getByTeacher(@PathVariable String teacherId) {
        return courseOfferingRepository.findByTeacher_Id(teacherId);
    }

    @PostMapping
    public CourseOffering createCourseOffering(@RequestParam String courseId,
                                                @RequestParam String teacherId,
                                                @RequestParam int year) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));

        CourseOfferingId offeringId = new CourseOfferingId(courseId, teacherId);
        CourseOffering offering = new CourseOffering();
        offering.setId(offeringId);
        offering.setCourse(course);
        offering.setTeacher(teacher);
        offering.setYear(year);

        return courseOfferingRepository.save(offering);
    }

    @DeleteMapping
    public void deleteCourseOffering(@RequestParam String courseId, @RequestParam String teacherId) {
        CourseOfferingId id = new CourseOfferingId(courseId, teacherId);
        courseOfferingRepository.deleteById(id);
    }
}
