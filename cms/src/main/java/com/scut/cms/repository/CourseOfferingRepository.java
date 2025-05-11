package com.scut.cms.repository;

import com.scut.cms.model.CourseOffering;
import com.scut.cms.model.CourseOfferingId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseOfferingRepository extends JpaRepository<CourseOffering, CourseOfferingId> {
    List<CourseOffering> findByTeacher_Id(String teacherId);
}
