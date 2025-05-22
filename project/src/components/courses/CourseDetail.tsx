// import React from 'react';
// import { useParams } from 'react-router-dom';

// const CourseDetail = () => {
//   const { id } = useParams();

//   return (
//     <div className="container mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Course Details</h1>
//       <div className="bg-white rounded-lg shadow p-6">
//         <p className="text-gray-600">Course details for ID: {id} will be implemented here</p>
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { BookOpen, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import CourseForm from './CourseForm';

type Course = {
  id: string;
  name: string;
  credit: number;
  grade: string;
  canceledYear: number | null;
};

type Enrollment = {
  id: number;
  student: {
    id: string;
    name: string;
    studentClass: string;
  };
  chosenYear: number;
  score: number | null;
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(location.state?.edit || false);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (id) {
      fetchCourseData(id);
    }
  }, [id]);

  const fetchCourseData = async (courseId: string) => {
    setIsLoading(true);
    try {
      const [courseResponse, enrollmentsResponse] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/course-choosings?courseId=${courseId}`)
      ]);

      setCourse(courseResponse.data);
      setEnrollments(enrollmentsResponse.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async (updatedData: Course) => {
    try {
      const response = await api.put(`/courses/${id}`, updatedData);
      setCourse(response.data);
      setIsEditMode(false);
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h2>
          <p className="mb-6">The course you're looking for could not be found.</p>
          <Link 
            to="/courses" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          to="/courses" 
          className="inline-flex items-center text-blue-800 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
        </Link>
        
        {isAdmin && !isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit Course
          </button>
        )}
        
        {isEditMode && (
          <button
            onClick={() => setIsEditMode(false)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <X className="h-4 w-4 mr-1" /> Cancel Edit
          </button>
        )}
      </div>

      {isEditMode ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Course</h2>
          <CourseForm 
            initialData={course} 
            onSubmit={handleUpdateCourse} 
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{course.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Course ID</p>
              <p className="text-lg font-medium">{course.id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Credits</p>
              <p className="text-lg font-medium">{course.credit}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Grade</p>
              <p className="text-lg font-medium">{course.grade}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Canceled Year</p>
              <p className="text-lg font-medium">{course.canceledYear || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <BookOpen className="h-5 w-5 text-blue-800 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
        </div>
        
        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollment.student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollment.student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.student.studentClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.chosenYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.score !== null ? enrollment.score : 'Not graded'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No students are enrolled in this course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;