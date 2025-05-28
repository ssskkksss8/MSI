import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { User, Edit, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import StudentForm from './StudentForm';

type Student = {
  id: string;
  name: string;
  sex: string;
  entranceAge: number;
  entranceYear: number;
  studentClass: string;
};

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // State for averages
  const [averageStudent, setAverageStudent] = useState<number | null>(null);
  const [averageAll, setAverageAll] = useState<number | null>(null);
  const [averageClass, setAverageClass] = useState<number | null>(null);
  const [averageCourse, setAverageCourse] = useState<number | null>(null);
  const [classQuery, setClassQuery] = useState('');
  const [courseQuery, setCourseQuery] = useState('');
  const [studentQuery, setStudentQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter(student => student.id !== id));
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const response = await api.post('/students', studentData);
      setStudents([...students, response.data]);
      setShowAddForm(false);
      toast.success('Student added successfully');
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Средние баллы ---
  const fetchAverageStudent = async () => {
    if (!studentQuery) return;
    try {
      const res = await api.get(`/course-choosings/average-score/student/${studentQuery}`);
      setAverageStudent(res.data);
    } catch {
      setAverageStudent(null);
      toast.error('Failed to fetch average for student');
    }
  };

  const fetchAverageAll = async () => {
    try {
      const res = await api.get(`/course-choosings/average-score/all`);
      setAverageAll(res.data);
    } catch {
      setAverageAll(null);
      toast.error('Failed to fetch average for all students');
    }
  };

  const fetchAverageClass = async () => {
    if (!classQuery) return;
    try {
      const res = await api.get(`/course-choosings/average-score/class/${classQuery}`);
      setAverageClass(res.data);
    } catch {
      setAverageClass(null);
      toast.error('Failed to fetch average for class');
    }
  };

  const fetchAverageCourse = async () => {
    if (!courseQuery) return;
    try {
      const res = await api.get(`/course-choosings/average-score/course/${courseQuery}`);
      setAverageCourse(res.data);
    } catch {
      setAverageCourse(null);
      toast.error('Failed to fetch average for course');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* --- Средние баллы --- */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs">Student ID</label>
          <input
            type="text"
            value={studentQuery}
            onChange={e => setStudentQuery(e.target.value)}
            className="form-input"
            placeholder="Student ID"
          />
          <button onClick={fetchAverageStudent} className="ml-2 btn btn-blue">Avg by Student</button>
          {averageStudent !== null && (
            <span className="ml-2 text-sm text-gray-700">Avg: {averageStudent?.toFixed(2)}</span>
          )}
        </div>
        <div>
          <button onClick={fetchAverageAll} className="btn btn-blue">Avg All Students</button>
          {averageAll !== null && (
            <span className="ml-2 text-sm text-gray-700">Avg: {averageAll?.toFixed(2)}</span>
          )}
        </div>
        <div>
          <label className="block text-xs">Class</label>
          <input
            type="text"
            value={classQuery}
            onChange={e => setClassQuery(e.target.value)}
            className="form-input"
            placeholder="Class"
          />
          <button onClick={fetchAverageClass} className="ml-2 btn btn-blue">Avg by Class</button>
          {averageClass !== null && (
            <span className="ml-2 text-sm text-gray-700">Avg: {averageClass?.toFixed(2)}</span>
          )}
        </div>
        <div>
          <label className="block text-xs">Course ID</label>
          <input
            type="text"
            value={courseQuery}
            onChange={e => setCourseQuery(e.target.value)}
            className="form-input"
            placeholder="Course ID"
          />
          <button onClick={fetchAverageCourse} className="ml-2 btn btn-blue">Avg by Course</button>
          {averageCourse !== null && (
            <span className="ml-2 text-sm text-gray-700">Avg: {averageCourse?.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        {isAdmin && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showAddForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-1" /> Add Student</>}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Student</h2>
          <StudentForm onSubmit={handleAddStudent} />
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name, ID, or class..."
            className="pl-10 form-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.sex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.entranceAge}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.entranceYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link 
                          to={`/students/${student.id}`}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <User className="h-5 w-5" />
                        </Link>
                        {isAdmin && (
                          <>
                            <Link 
                              to={`/students/${student.id}`} 
                              state={{ edit: true }}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;