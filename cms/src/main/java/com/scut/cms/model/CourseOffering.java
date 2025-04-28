package com.scut.cms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_offerings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseOffering {

    @EmbeddedId
    private CourseOfferingId id;

    @Column(nullable = false)
    private int year;

    public CourseOffering(Course course, Teacher teacher, int year) {
        this.id = new CourseOfferingId(course, teacher);
        this.year = year;
    }
}
