package com.scut.cms.repository;

import com.scut.cms.model.CourseOffering;
import com.scut.cms.model.CourseOfferingId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseOfferingRepository extends JpaRepository<CourseOffering, CourseOfferingId> {
}