import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { BookOpen, ArrowLeft, Edit, Save, X } from 'lucide-react';
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

type Enrollment = {
  id: number;
  student: Student;
  courseOffering: {
    course: {
      id: string;
      name: string;
      credit: number;
    };
    teacher: {
      id: string;
      name: string;
    };
  };
  chosenYear: number;
  score: number | null;
};

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(location.state?.edit || false);
  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';

  useEffect(() => {
    if (id) {
      fetchStudentData(id);
    }
  }, [id]);

  const fetchStudentData = async (studentId: string) => {
    setIsLoading(true);
    try {
      const [studentResponse, enrollmentsResponse] = await Promise.all([
        api.get(`/students/${studentId}`),
        api.get('/course-choosings')
      ]);
      
      setStudent(studentResponse.data);
      
      // Filter enrollments for this student
      const studentEnrollments = enrollmentsResponse.data.filter(
        (enrollment: Enrollment) => enrollment.student.id === studentId
      );
      
      setEnrollments(studentEnrollments);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (updatedData: Student) => {
    try {
      const response = await api.put(`/students/${id}`, updatedData);
      setStudent(response.data);
      setIsEditMode(false);
      toast.success('Student updated successfully');
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  const handleUpdateScore = async (enrollmentId: number, score: number) => {
    try {
      await api.put(`/course-choosings/${enrollmentId}/score?score=${score}`);
      
      // Update the score in the local state
      setEnrollments(prevEnrollments => 
        prevEnrollments.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { ...enrollment, score } 
            : enrollment
        )
      );
      
      toast.success('Score updated successfully');
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Failed to update score');
    }
  };

  const calculateGPA = () => {
    if (enrollments.length === 0 || !enrollments.some(e => e.score !== null)) {
      return 'N/A';
    }
    
    const validEnrollments = enrollments.filter(e => e.score !== null);
    const totalCredits = validEnrollments.reduce((sum, e) => sum + e.courseOffering.course.credit, 0);
    const weightedScoreSum = validEnrollments.reduce((sum, e) => {
      const score = e.score || 0;
      const credit = e.courseOffering.course.credit;
      // Simple conversion: score/20 to get a 5-point scale
      const gradePoint = score / 20;
      return sum + (gradePoint * credit);
    }, 0);
    
    return (weightedScoreSum / totalCredits).toFixed(2);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Student Not Found</h2>
          <p className="mb-6">The student you're looking for could not be found.</p>
          <Link 
            to="/students" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          to="/students" 
          className="inline-flex items-center text-blue-800 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Students
        </Link>
        
        {isAdmin && !isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit Student
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Student</h2>
          <StudentForm 
            initialData={student} 
            onSubmit={handleUpdateStudent} 
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{student.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Student ID</p>
              <p className="text-lg font-medium">{student.id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-lg font-medium">{student.sex}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Class</p>
              <p className="text-lg font-medium">{student.studentClass}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Entrance Age</p>
              <p className="text-lg font-medium">{student.entranceAge}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-500">Entrance Year</p>
              <p className="text-lg font-medium">{student.entranceYear}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm font-medium text-blue-800">GPA</p>
              <p className="text-lg font-bold text-blue-800">{calculateGPA()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <BookOpen className="h-5 w-5 text-blue-800 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Enrolled Courses</h2>
        </div>
        
        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
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
                      {enrollment.courseOffering.course.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollment.courseOffering.course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.courseOffering.teacher.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.chosenYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.courseOffering.course.credit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isTeacher ? (
                        <div className="flex items-center space-x-2">
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            className="w-16 form-input"
                            value={enrollment.score || ''}
                            onChange={(e) => {
                              const newScore = parseInt(e.target.value, 10);
                              setEnrollments(prevEnrollments => 
                                prevEnrollments.map(item => 
                                  item.id === enrollment.id 
                                    ? { ...item, score: isNaN(newScore) ? null : newScore } 
                                    : item
                                )
                              );
                            }}
                          />
                          <button
                            onClick={() => enrollment.score !== null && 
                              handleUpdateScore(enrollment.id, enrollment.score)}
                            className="text-green-600 hover:text-green-700"
                            disabled={enrollment.score === null}
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={
                          enrollment.score === null 
                            ? 'text-gray-500' 
                            : ((enrollment.score || 0) >= 60 
                              ? 'text-green-600 font-medium' 
                              : 'text-red-600 font-medium')
                        }>
                          {enrollment.score === null ? 'Not graded' : enrollment.score}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>This student is not enrolled in any courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;