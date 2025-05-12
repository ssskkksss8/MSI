import React, { useState, useEffect } from 'react';
import { BookOpen, Users, UserCheck, BarChart2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { getStudents, getCourses, getTeachers, getRegistrations, getAllStudentsAverageScore } from '../services/api';
import { Student, Course, Teacher, CourseRegistration } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser, login } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [studentData, courseData, teacherData, registrationData, avgScore] = await Promise.all([
          getStudents().catch(() => []),
          getCourses().catch(() => []),
          getTeachers().catch(() => []),
          getRegistrations().catch(() => []),
          getAllStudentsAverageScore().catch(() => 0)
        ]);
        
        setStudents(studentData);
        setCourses(courseData);
        setTeachers(teacherData);
        setRegistrations(registrationData);
        setAverageScore(avgScore);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Unable to connect to the server. Please ensure the backend server is running.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Student Information Management System
          </h2>
          <div className="space-y-4">
            <Button
              fullWidth
              onClick={() => login('student', '0123456789', 'John Doe')}
            >
              Login as Student
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => login('teacher', '12345', 'Dr. Robert Brown')}
            >
              Login as Teacher
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => login('administrator', 'admin', 'Admin User')}
            >
              Login as Administrator
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Courses',
      value: courses.length,
      icon: <BookOpen className="h-8 w-8 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Total Teachers',
      value: teachers.length,
      icon: <UserCheck className="h-8 w-8 text-amber-600" />,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Average Score',
      value: averageScore.toFixed(2),
      icon: <BarChart2 className="h-8 w-8 text-violet-600" />,
      color: 'bg-violet-50 text-violet-600',
    },
  ];

  // Recent registrations for the table
  const recentRegistrations = registrations
    .sort((a, b) => b.chosenYear - a.chosenYear)
    .slice(0, 5);

  // Enhance registrations with student and course information
  const enhancedRegistrations = recentRegistrations.map(registration => {
    const student = students.find(s => s.id === registration.studentId);
    const course = courses.find(c => c.id === registration.courseId);
    
    return {
      ...registration,
      studentName: student?.name || 'Unknown Student',
      courseName: course?.name || 'Unknown Course',
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser.name}</p>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-100">
          <div className="flex items-center space-x-3 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Recent Course Registrations">
              <Table
                columns={[
                  { header: 'Student', accessor: 'studentName' },
                  { header: 'Course', accessor: 'courseName' },
                  { 
                    header: 'Score', 
                    accessor: (row) => row.score !== null ? row.score : 'Not graded',
                    className: 'text-right' 
                  },
                  { 
                    header: 'Year', 
                    accessor: 'chosenYear',
                    className: 'text-right' 
                  },
                ]}
                data={enhancedRegistrations}
                keyField="studentId"
                emptyMessage="No recent registrations"
              />
            </Card>

            <Card title="Quick Actions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.role === 'student' && (
                  <>
                    <Button fullWidth variant="primary">
                      View My Courses
                    </Button>
                    <Button fullWidth variant="outline">
                      Register for New Course
                    </Button>
                    <Button fullWidth variant="secondary">
                      View My Grades
                    </Button>
                    <Button fullWidth variant="outline">
                      Academic Progress
                    </Button>
                  </>
                )}
                
                {currentUser.role === 'teacher' && (
                  <>
                    <Button fullWidth variant="primary">
                      Manage My Courses
                    </Button>
                    <Button fullWidth variant="outline">
                      Grade Students
                    </Button>
                    <Button fullWidth variant="secondary">
                      View Class Performance
                    </Button>
                    <Button fullWidth variant="outline">
                      Student Attendance
                    </Button>
                  </>
                )}
                
                {currentUser.role === 'administrator' && (
                  <>
                    <Button fullWidth variant="primary">
                      Manage Students
                    </Button>
                    <Button fullWidth variant="outline">
                      Manage Courses
                    </Button>
                    <Button fullWidth variant="secondary">
                      Manage Teachers
                    </Button>
                    <Button fullWidth variant="outline">
                      System Reports
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;