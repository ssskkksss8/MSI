import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

type Enrollment = {
  id: number;
  student: { id: string; name: string } | null;
  courseOffering: {
    course: { id: string; name: string } | null;
    teacher: { id: string; name: string } | null;
  } | null;
  chosenYear: number;
  score: number | null;
};

const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [chosenYear, setChosenYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/course-choosings');
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to load enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Формируем query-параметры
      const params = new URLSearchParams({
        studentId,
        courseId,
        teacherId,
        chosenYear: chosenYear.toString(),
      });

      // Отправляем запрос с query-параметрами
      await api.post(`/course-choosings?${params.toString()}`);
      toast.success('Enrollment added successfully');
      fetchEnrollments(); // Обновляем список зачислений
      setStudentId('');
      setCourseId('');
      setTeacherId('');
      setChosenYear(new Date().getFullYear());
    } catch (error) {
      console.error('Error adding enrollment:', error);
      toast.error('Failed to add enrollment');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) {
      return;
    }

    try {
      await api.delete(`/course-choosings/${id}`);
      setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id));
      toast.success('Enrollment deleted successfully');
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      toast.error('Failed to delete enrollment');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Enrollments</h1>

      {isAdmin && (
        <form onSubmit={handleAddEnrollment} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Course ID"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Teacher ID"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={chosenYear}
              onChange={(e) => setChosenYear(Number(e.target.value))}
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Enrollment
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {enrollments.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.student?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.courseOffering?.course?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.courseOffering?.teacher?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enrollment.chosenYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enrollment.score !== null ? enrollment.score : 'Not graded'}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No enrollments found.</p>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsPage;