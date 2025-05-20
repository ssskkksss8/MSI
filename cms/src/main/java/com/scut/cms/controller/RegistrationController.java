// RegistrationController.java
package com.scut.cms.controller;

import com.scut.cms.dto.RegisterRequest;
import com.scut.cms.model.Role;
import java.util.Map;
import java.util.Collections;
import com.scut.cms.model.User;
import com.scut.cms.model.Student;
import com.scut.cms.repository.UserRepository;
import com.scut.cms.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/auth")
public class RegistrationController {

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

    @CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest req) {
        System.out.println("");
        System.out.println("");
        System.out.println("Received: " + req);
        System.out.println("");
        System.out.println("");
        if (userRepo.existsById(req.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already registered");
        }
        // (по желанию) проверка, что такой студент есть:
        // Student student = studentRepo.findById(req.getUsername()).orElse(null);
        // if (student == null && req.getRole().equalsIgnoreCase("STUDENT")) {
        //     return ResponseEntity.badRequest().body("Student not found");
        // }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.valueOf("ROLE_" + req.getRole().toUpperCase()));
        userRepo.save(user);
    }

    @GetMapping("/hi")
    public ResponseEntity<Map<String, String>> sayHi() {
        return ResponseEntity.ok(Collections.singletonMap("message", "Hi"));
    }

}
