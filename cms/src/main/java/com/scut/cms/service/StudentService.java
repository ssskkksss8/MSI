package com.scut.cms.service;

import com.scut.cms.model.CourseChoosing;
import com.scut.cms.model.Student;
import com.scut.cms.repository.CourseChoosingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final CourseChoosingRepository courseChoosingRepository;

    public StudentService(CourseChoosingRepository courseChoosingRepository){
        this.courseChoosingRepository = courseChoosingRepository;
    }

    public List<Student> getStudentByCourseAndScore(String courseId, int score, boolean greaterThan){
        List<CourseChoosing> choosings = greaterThan
            ? courseChoosingRepository.findByCourseOffering_Course_IdAndScoreGreaterThan(courseId, score)
            : courseChoosingRepository.findByCourseOffering_Course_IdAndScoreLessThan(courseId, score);
        return choosings.stream()
            .map(CourseChoosing::getStudent)
            .distinct()
            .collect(Collectors.toList());
    }
}