package com.scut.cms.controller;

import com.scut.cms.model.CourseChoosing;
import com.scut.cms.model.CourseOffering;
import com.scut.cms.model.CourseOfferingId;
import com.scut.cms.model.Student;
import com.scut.cms.repository.CourseChoosingRepository;
import com.scut.cms.repository.CourseOfferingRepository;
import com.scut.cms.repository.StudentRepository;
import com.scut.cms.repository.CourseRepository;
import com.scut.cms.repository.TeacherRepository;
import com.scut.cms.service.StudentService; 

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-choosings")
public class CourseChoosingController {

    private final CourseChoosingRepository courseChoosingRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final StudentService studentService;          

    @Autowired
    public CourseChoosingController(CourseChoosingRepository courseChoosingRepository,
                                    StudentRepository studentRepository,
                                    CourseOfferingRepository courseOfferingRepository,
                                    CourseRepository courseRepository,
                                    TeacherRepository teacherRepository,
                                    StudentService studentService) {           
        this.courseChoosingRepository = courseChoosingRepository;
        this.studentRepository = studentRepository;
        this.courseOfferingRepository = courseOfferingRepository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
        this.studentService = studentService;            
    }

    @GetMapping
    public List<CourseChoosing> getAllCourseChoosings() {
        return courseChoosingRepository.findAll();
    }

    @GetMapping("/by-course")
    public List<Student> getStudentsByCourseAndYear(@RequestParam String courseId,
                                                    @RequestParam int year) {
        return courseChoosingRepository.findByCourseOffering_Course_IdAndChosenYear(courseId, year)
                                      .stream()
                                      .map(CourseChoosing::getStudent)
                                      .toList();
    }


    @GetMapping("/average-score")
    public Double getAverageScore(@RequestParam String courseId) {
        return courseChoosingRepository.calculateAverageScoreByCourseId(courseId);
    }

    @GetMapping("/filter")
    public List<Student> filterStudentsByScore(
            @RequestParam String courseId,
            @RequestParam int score,
            @RequestParam boolean greaterThan
    ) {
        return studentService.getStudentByCourseAndScore(courseId, score, greaterThan);
    }

    @PostMapping
    public CourseChoosing createCourseChoosing(@RequestParam String studentId,
                                               @RequestParam String courseId,
                                               @RequestParam String teacherId,
                                               @RequestParam int chosenYear) {
        var student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        var course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        var teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));

        var offeringId = new CourseOfferingId(courseId, teacherId);
        var offering = courseOfferingRepository.findById(offeringId)
            .orElseThrow(() -> new RuntimeException("Course Offering not found: " + offeringId));

        var choosing = new CourseChoosing();
        choosing.setStudent(student);
        choosing.setCourseOffering(offering);
        choosing.setChosenYear(chosenYear);

        return courseChoosingRepository.save(choosing);
    }

    @PutMapping("/{id}/score")
    public CourseChoosing updateScore(@PathVariable Long id, @RequestParam int score) {
        var choosing = courseChoosingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("CourseChoosing not found: " + id));

        choosing.setScore(score);
        return courseChoosingRepository.save(choosing);
    }

    @GetMapping("/scores")
    public List<CourseChoosing> scores(
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) String courseName
    ) {
        var list = courseChoosingRepository.findAll();

        if (studentId != null) {
            list = list.stream()
                    .filter(c -> c.getStudent().getId().equals(studentId))
                    .collect(Collectors.toList());
        } else if (studentName != null) {
            list = list.stream()
                    .filter(c -> c.getStudent().getName().equalsIgnoreCase(studentName))
                    .collect(Collectors.toList());
        }

        if (courseId != null) {
            list = list.stream()
                    .filter(c -> c.getCourseOffering().getCourse().getId().equals(courseId))
                    .collect(Collectors.toList());
        } else if (courseName != null) {
            list = list.stream()
                    .filter(c -> c.getCourseOffering().getCourse().getName().equalsIgnoreCase(courseName))
                    .collect(Collectors.toList());
        }

        return list;
    }

    @DeleteMapping("/{id}")
    public void deleteCourseChoosing(@PathVariable Long id) {
        courseChoosingRepository.deleteById(id);
    }
}
