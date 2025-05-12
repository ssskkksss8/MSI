import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardCard from './DashboardCard';
import api from '../../services/api';
import { UsersRound, GraduationCap, BookOpen, Award } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    teachers: 0,
    enrollments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [students, courses, teachers, enrollments] = await Promise.all([
          api.get('/students'),
          api.get('/courses'),
          api.get('/teachers'),
          api.get('/course-choosings')
        ]);

        setStats({
          students: students.data.length,
          courses: courses.data.length,
          teachers: teachers.data.length,
          enrollments: enrollments.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userRole = user?.role || '';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{greeting()}, {user?.username}</h1>
        <p className="mt-2 text-gray-600">Welcome to the Course Management System. Here's an overview of your academic information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Students"
          count={stats.students}
          icon={<UsersRound className="h-6 w-6 text-blue-800" />}
          linkTo="/students"
          color="border-blue-500"
        />
        <DashboardCard
          title="Courses"
          count={stats.courses}
          icon={<BookOpen className="h-6 w-6 text-green-600" />}
          linkTo="/courses"
          color="border-green-500"
        />
        <DashboardCard
          title="Teachers"
          count={stats.teachers}
          icon={<GraduationCap className="h-6 w-6 text-purple-600" />}
          linkTo="/teachers"
          color="border-purple-500"
        />
        <DashboardCard
          title="Enrollments"
          count={stats.enrollments}
          icon={<Award className="h-6 w-6 text-amber-500" />}
          linkTo="/enrollments"
          color="border-amber-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Role: {userRole}</h2>
        <div className="space-y-3">
          {userRole === 'ADMIN' && (
            <>
              <p>As an <span className="font-medium">Administrator</span>, you can:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Manage all student information</li>
                <li>Create and modify course details</li>
                <li>Manage teacher information</li>
                <li>Handle course enrollments</li>
                <li>View academic statistics</li>
              </ul>
            </>
          )}
          {userRole === 'TEACHER' && (
            <>
              <p>As a <span className="font-medium">Teacher</span>, you can:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>View student information</li>
                <li>Update student scores</li>
                <li>View course details</li>
                <li>View enrollment information</li>
                <li>Track student performance</li>
              </ul>
            </>
          )}
          {userRole === 'STUDENT' && (
            <>
              <p>As a <span className="font-medium">Student</span>, you can:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>View your personal information</li>
                <li>Browse available courses</li>
                <li>Check course requirements</li>
                <li>View your enrolled courses</li>
                <li>Check your academic performance</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;