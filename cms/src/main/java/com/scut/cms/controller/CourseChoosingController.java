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

    @GetMapping("/student/{studentId}")
    public List<CourseChoosing> getCoursesByStudent(@PathVariable String studentId) {
        return courseChoosingRepository.findByStudent_Id(studentId);
    }

    @GetMapping("/average-score/student/{studentId}")
    public Double getAverageScoreByStudent(@PathVariable String studentId) {
        return courseChoosingRepository.averageScoreByStudent(studentId);
    }

    @GetMapping("/average-score/all")
    public Double getAverageScoreAll() {
        return courseChoosingRepository.averageScoreAll();
    }

    @GetMapping("/average-score/class/{studentClass}")
    public Double getAverageScoreByClass(@PathVariable String studentClass) {
        return courseChoosingRepository.averageScoreByClass(studentClass);
    }

    @GetMapping("/average-score/course/{courseId}")
    public Double getAverageScoreByCourse(@PathVariable String courseId) {
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

    @DeleteMapping("/{id}")
    public void deleteCourseChoosing(@PathVariable Long id) {
        courseChoosingRepository.deleteById(id);
    }
}
