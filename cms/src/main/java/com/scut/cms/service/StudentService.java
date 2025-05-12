package com.scut.cms.service;

import com.scut.cms.model.CourseChoosing;
import com.scut.cms.model.Student;
import com.scut.cms.repository.CourseChoosingRepository;
import java.util.List;

import java.util.stream.Collectors;


import org.springframework.stereotype.Service;

import java.util.DoubleSummaryStatistics;

@Service
public class StudentService {
    private final CourseChoosingRepository choosingRepo;

    public StudentService(CourseChoosingRepository choosingRepo) {
        this.choosingRepo = choosingRepo;
    }

    public double averageForStudent(String studentId) {
        return choosingRepo.findByStudent_Id(studentId).stream()
                .mapToInt(CourseChoosing::getScore)
                .average().orElse(0.0);
    }

    public double averageForClass(String className) {
        return choosingRepo.findAll().stream()
                .map(CourseChoosing::getStudent)
                .filter(s -> className.equals(s.getStudentClass()))
                .map(Student::getId)
                .distinct()
                .flatMap(id -> choosingRepo.findByStudent_Id(id).stream())
                .mapToInt(CourseChoosing::getScore)
                .average().orElse(0.0);
    }

    public double averageAllStudents() {
        return choosingRepo.findAll().stream()
                .mapToInt(CourseChoosing::getScore)
                .average().orElse(0.0);
    }

    public List<Student> getStudentByCourseAndScore(String courseId, int score, boolean gt) {
        var list = gt
            ? choosingRepo.findByCourseOffering_Course_IdAndScoreGreaterThan(courseId, score)
            : choosingRepo.findByCourseOffering_Course_IdAndScoreLessThan(courseId, score);
        return list.stream()
                   .map(CourseChoosing::getStudent)
                   .distinct()
                   .collect(Collectors.toList());
    }
}
