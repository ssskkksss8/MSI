package com.scut.cms.controller;

import com.scut.cms.model.User;
import com.scut.cms.model.Role;
import com.scut.cms.model.Student;
import com.scut.cms.repository.UserRepository;
import com.scut.cms.repository.StudentRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/auth")
public class RegistrationController{
    private final StudentRepository studentRepo;
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public RegistrationController(StudentRepository studentRepo,
                                  UserRepository userRepo,
                                  BCryptPasswordEncoder passwordEncoder) {
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String studentId,
                                           @RequestParam String password) {
        Student student = studentRepo.findById(studentId)
            .orElse(null);
        if (student == null) {
            return ResponseEntity
                .badRequest()
                .body("Student with this ID not found");
        }
            if (userRepo.existsById(studentId)) {
            return ResponseEntity
                .badRequest()
                .body("User already registered");
        }
        User user = new User();
        user.setUsername(studentId);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.ROLE_STUDENT);
        userRepo.save(user);

        return ResponseEntity.ok("Registration completed successfully");
    }
}