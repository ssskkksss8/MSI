package com.scut.cms.controller;

import com.scut.cms.model.Student;
import com.scut.cms.repository.StudentRepository;
import com.scut.cms.repository.CourseChoosingRepository;
import com.scut.cms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

import com.scut.cms.model.CourseChoosing;
import com.scut.cms.model.CourseOffering;


import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Autowired
    private CourseChoosingRepository choosingRepo;

    @Autowired
    private StudentService studentService;


    @GetMapping
    public List<Student> list(@RequestParam(required = false) String id,
                              @RequestParam(required = false) String name) {
        if (id != null) return studentRepository.findById(id).map(List::of)
                .orElse(List.of());
        if (name != null) return studentRepository.findByNameContainingIgnoreCase(name);
        return studentRepository.findAll();
    }

    @GetMapping("/{id}/courses")
    public List<CourseChoosing> studentCoursesById(@PathVariable String id) {
        return choosingRepo.findByStudent_Id(id);
    }
    @GetMapping("/search/courses")
    public List<CourseChoosing> studentCoursesByName(@RequestParam String name) {
        return studentRepository.findByNameContainingIgnoreCase(name).stream()
                .flatMap(s -> choosingRepo.findByStudent_Id(s.getId()).stream())
                .collect(Collectors.toList());
    }

    @GetMapping("/average-score")
    public Double averageScore(@RequestParam(required = false) String studentId,
                               @RequestParam(required = false) String className) {
        if (studentId != null) {
            return studentService.averageForStudent(studentId);
        } else if (className != null) {
            return studentService.averageForClass(className);
        } else {
            return studentService.averageAllStudents();
        }
    }

    @PostMapping
    public Student addStudent(@Valid @RequestBody Student student) {
        return studentRepository.save(student);
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student with this ID not found: " + id));
    }

    @GetMapping("/search")
    public List<Student> searchStudentsByName(@RequestParam String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable String id, @Valid @RequestBody Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student with this ID not found: " + id));

        student.setName(studentDetails.getName());
        student.setSex(studentDetails.getSex());
        student.setEntranceAge(studentDetails.getEntranceAge());
        student.setEntranceYear(studentDetails.getEntranceYear());
        student.setStudentClass(studentDetails.getStudentClass());

        return studentRepository.save(student);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable String id) {
        studentRepository.deleteById(id);
    }
}
