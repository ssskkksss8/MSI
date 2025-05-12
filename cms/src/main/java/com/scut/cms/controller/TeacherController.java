package com.scut.cms.controller;

import com.scut.cms.model.Teacher;
import com.scut.cms.repository.TeacherRepository;
import com.scut.cms.repository.StudentRepository;
import com.scut.cms.repository.CourseOfferingRepository;
import com.scut.cms.repository.CourseChoosingRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.scut.cms.model.CourseOffering;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {
    
    private final TeacherRepository teacherRepository;

    @Autowired
    public TeacherController(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @Autowired
    private StudentRepository studentRepo;
    @Autowired
    private CourseChoosingRepository choosingRepo;
    @Autowired
    private CourseOfferingRepository offeringRepo;


    @GetMapping
    public List<Teacher> list(@RequestParam(required = false) String id,
                            @RequestParam(required = false) String name) {
        if (id != null) return teacherRepository.findById(id).map(List::of).orElse(List.of());
        if (name != null) return teacherRepository.findByNameContainingIgnoreCase(name);
        return teacherRepository.findAll();
    }

    @GetMapping("/{id}/courses")
    public List<CourseOffering> coursesByTeacher(@PathVariable String id) {
        return offeringRepo.findByTeacher_Id(id);
    }

    @GetMapping("/{id}")
    public Teacher getTeacherByID(@PathVariable String id){
        return teacherRepository.findById(id).orElseThrow(() -> new RuntimeException("Teacher with this ID not found: " + id));
    }
  
    @GetMapping("/search")
    public List<Teacher> searchTeachersByName(@RequestParam String name) {
        return teacherRepository.findByNameContainingIgnoreCase(name);
    }

    @PostMapping
    public Teacher addTeacher(@Valid @RequestBody Teacher teacher){
        return teacherRepository.save(teacher);
    }

    @PutMapping("/{id}")
    public Teacher updateTeacher(@PathVariable String id, @Valid @RequestBody Teacher teacherDetails) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher with this ID not found: " + id));

        teacher.setName(teacherDetails.getName());

        return teacherRepository.save(teacher);
    }

    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable String id){
        teacherRepository.deleteById(id);
    }

}