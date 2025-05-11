import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { 
  getStudents, 
  getCourses, 
  getStudentAverageScore, 
  getClassAverageScore, 
  getCourseAverageScore, 
  getAllStudentsAverageScore
} from '../services/api';
import { Student, Course, ScoreStatistics } from '../types';

const StatisticsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selected values
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  // Statistics
  const [studentAvg, setStudentAvg] = useState<number | null>(null);
  const [classAvg, setClassAvg] = useState<number | null>(null);
  const [courseStats, setCourseStats] = useState<ScoreStatistics | null>(null);
  const [overallAvg, setOverallAvg] = useState<number | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsData, coursesData] = await Promise.all([
        getStudents(),
        getCourses()
      ]);
      
      setStudents(studentsData);
      setCourses(coursesData);
      
      // Extract unique classes
      const uniqueClasses = Array.from(new Set(studentsData.map(s => s.class)));
      setClasses(uniqueClasses);
      
      // Get overall average
      const overall = await getAllStudentsAverageScore();
      setOverallAvg(overall);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedStudent) {
      fetchStudentAverage(selectedStudent);
    } else {
      setStudentAvg(null);
    }
  }, [selectedStudent]);
  
  useEffect(() => {
    if (selectedClass) {
      fetchClassAverage(selectedClass);
    } else {
      setClassAvg(null);
    }
  }, [selectedClass]);
  
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseStatistics(selectedCourse);
    } else {
      setCourseStats(null);
    }
  }, [selectedCourse]);
  
  const fetchStudentAverage = async (studentId: string) => {
    try {
      const avg = await getStudentAverageScore(studentId);
      setStudentAvg(avg);
    } catch (error) {
      console.error('Error fetching student average:', error);
      setStudentAvg(null);
    }
  };
  
  const fetchClassAverage = async (className: string) => {
    try {
      const avg = await getClassAverageScore(className);
      setClassAvg(avg);
    } catch (error) {
      console.error('Error fetching class average:', error);
      setClassAvg(null);
    }
  };
  
  const fetchCourseStatistics = async (courseId: string) => {
    try {
      const stats = await getCourseAverageScore(courseId);
      setCourseStats(stats);
    } catch (error) {
      console.error('Error fetching course statistics:', error);
      setCourseStats(null);
    }
  };
  
  const getColorForScore = (score: number): string => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-rose-600';
  };
  
  const getSelectedStudentName = (): string => {
    const student = students.find(s => s.id === selectedStudent);
    return student ? student.name : '';
  };
  
  const getSelectedCourseName = (): string => {
    const course = courses.find(c => c.id === selectedCourse);
    return course ? course.name : '';
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
        <p className="text-gray-500">View performance statistics</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4 bg-blue-50 text-blue-600">
                  <BarChart className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Overall Average</p>
                  <p className={`text-2xl font-bold ${getColorForScore(overallAvg || 0)}`}>
                    {overallAvg?.toFixed(2) || 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
            
            {studentAvg !== null && (
              <Card className="transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full mr-4 bg-emerald-50 text-emerald-600">
                    <BarChart className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{getSelectedStudentName()}'s Average</p>
                    <p className={`text-2xl font-bold ${getColorForScore(studentAvg)}`}>
                      {studentAvg.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            )}
            
            {classAvg !== null && (
              <Card className="transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full mr-4 bg-amber-50 text-amber-600">
                    <BarChart className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Class {selectedClass} Average</p>
                    <p className={`text-2xl font-bold ${getColorForScore(classAvg)}`}>
                      {classAvg.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            )}
            
            {courseStats !== null && (
              <Card className="transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full mr-4 bg-violet-50 text-violet-600">
                    <BarChart className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{getSelectedCourseName()} Average</p>
                    <p className={`text-2xl font-bold ${getColorForScore(courseStats.average)}`}>
                      {courseStats.average.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Student Performance">
              <div className="space-y-4">
                <Select
                  label="Select Student"
                  options={students.map(student => ({
                    value: student.id,
                    label: `${student.name} (${student.id})`
                  }))}
                  value={selectedStudent}
                  onChange={setSelectedStudent}
                  fullWidth
                />
                
                {studentAvg !== null && (
                  <div className="pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Student's Average:</span>
                      <span className={`font-semibold ${getColorForScore(studentAvg)}`}>
                        {studentAvg.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          studentAvg >= 90 ? 'bg-emerald-600' :
                          studentAvg >= 80 ? 'bg-blue-600' :
                          studentAvg >= 70 ? 'bg-amber-600' :
                          studentAvg >= 60 ? 'bg-orange-500' :
                          'bg-rose-600'
                        }`}
                        style={{ width: `${Math.min(studentAvg, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <Card title="Class Performance">
              <div className="space-y-4">
                <Select
                  label="Select Class"
                  options={classes.map(className => ({
                    value: className,
                    label: className
                  }))}
                  value={selectedClass}
                  onChange={setSelectedClass}
                  fullWidth
                />
                
                {classAvg !== null && (
                  <div className="pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Class Average:</span>
                      <span className={`font-semibold ${getColorForScore(classAvg)}`}>
                        {classAvg.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          classAvg >= 90 ? 'bg-emerald-600' :
                          classAvg >= 80 ? 'bg-blue-600' :
                          classAvg >= 70 ? 'bg-amber-600' :
                          classAvg >= 60 ? 'bg-orange-500' :
                          'bg-rose-600'
                        }`}
                        style={{ width: `${Math.min(classAvg, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <Card title="Course Statistics">
              <div className="space-y-4">
                <Select
                  label="Select Course"
                  options={courses.map(course => ({
                    value: course.id,
                    label: `${course.name} (${course.id})`
                  }))}
                  value={selectedCourse}
                  onChange={setSelectedCourse}
                  fullWidth
                />
                
                {courseStats !== null && (
                  <div className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Average</p>
                        <p className={`text-lg font-semibold ${getColorForScore(courseStats.average)}`}>
                          {courseStats.average.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Passing Rate</p>
                        <p className={`text-lg font-semibold ${
                          courseStats.passingRate >= 0.9 ? 'text-emerald-600' :
                          courseStats.passingRate >= 0.7 ? 'text-blue-600' :
                          courseStats.passingRate >= 0.5 ? 'text-amber-600' :
                          'text-rose-600'
                        }`}>
                          {(courseStats.passingRate * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Highest Score</p>
                        <p className="text-lg font-semibold text-emerald-600">
                          {courseStats.highest}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Lowest Score</p>
                        <p className="text-lg font-semibold text-rose-600">
                          {courseStats.lowest}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Score Distribution</p>
                      <div className="w-full h-4 flex rounded-md overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${courseStats.passingRate * 100}%` }}></div>
                        <div className="bg-rose-500 h-full" style={{ width: `${(1 - courseStats.passingRate) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        <span className="text-emerald-600">Passing: {(courseStats.passingRate * 100).toFixed(1)}%</span>
                        <span className="text-rose-600">Failing: {((1 - courseStats.passingRate) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;