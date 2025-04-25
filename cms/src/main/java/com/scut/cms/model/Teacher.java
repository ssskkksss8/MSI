package com.scut.cms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @Column(length = 5)
    @Size(min = 5, max = 5, message = "Id must contain exactly 5 characters")
    private String id;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @OneToMany(mappedBy = "teacher")
    private List<Course> courses;
}
