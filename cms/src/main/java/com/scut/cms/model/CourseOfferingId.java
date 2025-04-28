package com.scut.cms.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;


@Embeddable
public class CourseOfferingId implements Serializable {
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    public CourseOfferingId() {}

    public CourseOfferingId(Course course, Teacher teacher) {
        this.course = course;
        this.teacher = teacher;
    }

    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CourseOfferingId that = (CourseOfferingId) o;
        return course.equals(that.course) && teacher.equals(that.teacher);
    }

    @Override
    public int hashCode() {
        return Objects.hash(course, teacher);
    }

}
