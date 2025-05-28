package com.scut.cms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @Column(length = 7)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int credit;

    @Column(nullable = false)
    private int grade;

    private Integer canceledYear;
}
