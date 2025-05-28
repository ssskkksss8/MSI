import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

type Course = {
  id: string;
  name: string;
  credit: number;
  grade: number;
};

type CourseOffering = {
  id: number;
  course: Course;
  year: number;
};

const TeacherCoursesPage = () => {
  const { user } = useAuth(); // Получаем текущего пользователя
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user) {
      fetchTeacherCourses(user.id); // Используем ID текущего учителя
      fetchAllCourses(); // Загружаем все доступные курсы
    }
  }, [user]);

  const fetchTeacherCourses = async (teacherId: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/course-offerings/teacher/${teacherId}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      toast.error('Failed to load teacher courses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const response = await api.get('/courses');
      setAllCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourseId) {
      toast.error('Please select a course');
      return;
    }

    try {
      await api.post('/course-offerings', {
        courseId: selectedCourseId,
        teacherId: user?.id,
        year,
      });
      toast.success('Course added successfully');
      fetchTeacherCourses(user?.id || '');
      setShowAddModal(false);
      setSelectedCourseId('');
      setYear(new Date().getFullYear());
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await api.delete(`/course-offerings/${id}`);
      setCourses(courses.filter(course => course.id !== id));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Courses I Teach</h1>

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Plus className="h-5 w-5 inline-block mr-2" />
        Add Course
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Add a Course</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="form-select mt-1 block w-full"
              >
                <option value="">-- Select a Course --</option>
                {allCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="form-input mt-1 block w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {courses.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.course.credit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.course.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">You are not teaching any courses.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherCoursesPage;