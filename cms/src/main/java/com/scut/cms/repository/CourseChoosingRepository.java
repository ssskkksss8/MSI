package com.scut.cms.repository;

import com.scut.cms.model.CourseChoosing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseChoosingRepository extends JpaRepository<CourseChoosing, Long> {

    List<CourseChoosing> findByCourseOffering_Course_IdAndChosenYear(String courseId, int chosenYear);

    List<CourseChoosing> findByCourseOffering_Course_IdAndScoreGreaterThan(String courseId, int minScore);

    List<CourseChoosing> findByCourseOffering_Course_IdAndScoreLessThan(String courseId, int maxScore);

    @Query("SELECT AVG(c.score) FROM CourseChoosing c WHERE c.courseOffering.course.id = :courseId")
    Double calculateAverageScoreByCourseId(@Param("courseId") String courseId);
}
