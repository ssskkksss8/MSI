package com.scut.cms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "course_choosings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseChoosing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "course_id", referencedColumnName = "course_id"),
        @JoinColumn(name = "teacher_id", referencedColumnName = "teacher_id")
    })
    private CourseOffering courseOffering;

    @Column(nullable = false)
    private int chosenYear;

    @Min(0)
    @Max(100)
    private Integer score;
}
