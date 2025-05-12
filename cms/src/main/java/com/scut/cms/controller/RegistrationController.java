package com.scut.cms.controller;

import com.scut.cms.model.Role;
import com.scut.cms.model.User;
import com.scut.cms.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class RegistrationController {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public RegistrationController(UserRepository userRepo,
                                  BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // --- DTO класса регистрации ---
    public static class RegisterRequest {
        public String username;
        public String password;
        public String role; // "STUDENT", "TEACHER", "ADMIN"
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        // Проверка: пользователь уже существует?
        if (userRepo.existsById(request.username)) {
            return ResponseEntity
                    .badRequest()
                    .body("User already registered");
        }

        // Проверка: корректная ли роль
        Role selectedRole;
        try {
            selectedRole = Role.valueOf("ROLE_" + request.role.toUpperCase()); // ROLE_STUDENT и т.п.
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid role. Must be STUDENT, TEACHER, or ADMIN");
        }

        // Создание нового пользователя
        User user = new User();
        user.setUsername(request.username);
        user.setPassword(passwordEncoder.encode(request.password));
        user.setRole(selectedRole);

        userRepo.save(user);

        return ResponseEntity.ok("Registration completed successfully");
    }
}
