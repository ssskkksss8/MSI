package com.scut.cms.controller;

import com.scut.cms.model.CourseChoosing;
import com.scut.cms.model.CourseOffering;
import com.scut.cms.model.CourseOfferingId;
import com.scut.cms.model.Student;
import com.scut.cms.model.Course;
import com.scut.cms.model.Teacher;
import com.scut.cms.repository.CourseChoosingRepository;
import com.scut.cms.repository.CourseOfferingRepository;
import com.scut.cms.repository.StudentRepository;
import com.scut.cms.repository.CourseRepository;
import com.scut.cms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-choosings")
public class CourseChoosingController {

    private final CourseChoosingRepository courseChoosingRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;  // Добавлен CourseRepository
    private final TeacherRepository teacherRepository;  // Добавлен TeacherRepository

    @Autowired
    public CourseChoosingController(CourseChoosingRepository courseChoosingRepository,
                                     StudentRepository studentRepository,
                                     CourseOfferingRepository courseOfferingRepository,
                                     CourseRepository courseRepository,  // Добавлен CourseRepository в конструктор
                                     TeacherRepository teacherRepository) {  // Добавлен TeacherRepository в конструктор
        this.courseChoosingRepository = courseChoosingRepository;
        this.studentRepository = studentRepository;
        this.courseOfferingRepository = courseOfferingRepository;
        this.courseRepository = courseRepository;  // Присвоение поля
        this.teacherRepository = teacherRepository;  // Присвоение поля
    }

    @GetMapping
    public List<CourseChoosing> getAllCourseChoosings() {
        return courseChoosingRepository.findAll();
    }

    @PostMapping
    public CourseChoosing createCourseChoosing(@RequestParam String studentId,
                                                @RequestParam String courseId,  // Используем courseId и teacherId
                                                @RequestParam String teacherId, // для построения CourseOfferingId
                                                @RequestParam int chosenYear) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + teacherId));

        CourseOfferingId offeringId = new CourseOfferingId(courseId, teacherId);
        CourseOffering offering = courseOfferingRepository.findById(offeringId)
                .orElseThrow(() -> new RuntimeException("Course Offering not found: " + offeringId));

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
