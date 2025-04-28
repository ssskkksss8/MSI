package com.scut.cms.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CourseOfferingId implements Serializable {

    private String courseId;
    private String teacherId;

    public CourseOfferingId() {}

    public CourseOfferingId(String courseId, String teacherId) {
        this.courseId = courseId;
        this.teacherId = teacherId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CourseOfferingId that = (CourseOfferingId) o;
        return Objects.equals(courseId, that.courseId) &&
               Objects.equals(teacherId, that.teacherId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseId, teacherId);
    }
}
