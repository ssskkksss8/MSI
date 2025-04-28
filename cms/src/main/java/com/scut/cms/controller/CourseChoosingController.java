package com.scut.cms.controller;

import com.scut.cms.model.CourseChoosing;
import com.scut.cms.model.CourseOffering;
import com.scut.cms.model.Student;
import com.scut.cms.repository.CourseChoosingRepository;
import com.scut.cms.repository.CourseOfferingRepository;
import com.scut.cms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-choosings")
public class CourseChoosingController {

    private final CourseChoosingRepository courseChoosingRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository courseOfferingRepository;

    @Autowired
    public CourseChoosingController(CourseChoosingRepository courseChoosingRepository,
                                     StudentRepository studentRepository,
                                     CourseOfferingRepository courseOfferingRepository) {
        this.courseChoosingRepository = courseChoosingRepository;
        this.studentRepository = studentRepository;
        this.courseOfferingRepository = courseOfferingRepository;
    }

    @GetMapping
    public List<CourseChoosing> getAllCourseChoosings() {
        return courseChoosingRepository.findAll();
    }

    @PostMapping
    public CourseChoosing createCourseChoosing(@RequestParam String studentId,
                                                @RequestParam Long courseOfferingId,
                                                @RequestParam int chosenYear) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        CourseOffering offering = courseOfferingRepository.findById(courseOfferingId)
                .orElseThrow(() -> new RuntimeException("Course Offering not found: " + courseOfferingId));

        CourseChoosing choosing = new CourseChoosing();
        choosing.setStudent(student);
        choosing.setCourseOffering(offering);
        choosing.setChosenYear(chosenYear);

        return courseChoosingRepository.save(choosing);
    }

    @PutMapping("/{id}/score")
    public CourseChoosing updateScore(@PathVariable Long id, @RequestParam int score) {
        CourseChoosing choosing = courseChoosingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseChoosing not found: " + id));

        choosing.setScore(score);
        return courseChoosingRepository.save(choosing);
    }

    @DeleteMapping("/{id}")
    public void deleteCourseChoosing(@PathVariable Long id) {
        courseChoosingRepository.deleteById(id);
    }
}
