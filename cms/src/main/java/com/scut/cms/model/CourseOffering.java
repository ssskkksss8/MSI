package com.scut.cms.model;

import jakarta.persistence.*;

@Entity
public class CourseOffering {

    @EmbeddedId
    private CourseOfferingId id;

    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @MapsId("teacherId")
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    private int year;

    public CourseOffering() {}

    public CourseOffering(CourseOfferingId id, Course course, Teacher teacher, int year) {
        this.id = id;
        this.course = course;
        this.teacher = teacher;
        this.year = year;
    }

    public CourseOfferingId getId() {
        return id;
    }

    public void setId(CourseOfferingId id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
