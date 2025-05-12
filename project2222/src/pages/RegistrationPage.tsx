import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { 
  getRegistrations, getStudents, getCourses, getTeachers,
  createRegistration, updateRegistration, deleteRegistration
} from '../services/api';
import { CourseRegistration, Student, Course, Teacher } from '../types';
import { useAuth } from '../context/AuthContext';

const RegistrationPage: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingScore, setEditingScore] = useState<{
    studentId: string;
    courseId: string;
    currentScore: number | null;
  } | null>(null);
  const [newScore, setNewScore] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState<CourseRegistration>({
    studentId: '',
    courseId: '',
    teacherId: '',
    chosenYear: new Date().getFullYear(),
    score: null,
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [registrationsData, studentsData, coursesData, teachersData] = await Promise.all([
        getRegistrations(),
        getStudents(),
        getCourses(),
        getTeachers()
      ]);
      
      // If user is a student, filter registrations for only their courses
      let filteredRegistrations = registrationsData;
      if (currentUser?.role === 'student') {
        filteredRegistrations = registrationsData.filter(r => r.studentId === currentUser.entityId);
      }
      
      setRegistrations(filteredRegistrations);
      setStudents(studentsData);
      setCourses(coursesData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredRegistrations = registrations.filter(registration => {
    const student = students.find(s => s.id === registration.studentId);
    const course = courses.find(c => c.id === registration.courseId);
    
    return (
      (student && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      registration.studentId.includes(searchTerm) ||
      registration.courseId.includes(searchTerm)
    );
  });
  
  const resetForm = () => {
    setFormData({
      studentId: '',
      courseId: '',
      teacherId: '',
      chosenYear: new Date().getFullYear(),
      score: null,
    });
    setErrors({});
  };
  
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleDelete = async (registration: CourseRegistration) => {
    if (!confirm(`Are you sure you want to delete this registration?`)) return;
    
    try {
      await deleteRegistration(registration.studentId, registration.courseId);
      setRegistrations(registrations.filter(r => 
        !(r.studentId === registration.studentId && r.courseId === registration.courseId)
      ));
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'chosenYear' ? parseInt(value) : value
    }));
    
    // If courseId changes, try to set teacherId automatically
    if (name === 'courseId') {
      const course = courses.find(c => c.id === value);
      if (course) {
        setFormData(prev => ({
          ...prev,
          teacherId: course.teacherId,
          [name]: value
        }));
      }
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student is required';
    }
    
    if (!formData.courseId) {
      newErrors.courseId = 'Course is required';
    }
    
    if (!formData.teacherId) {
      newErrors.teacherId = 'Teacher is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Create new registration
      await createRegistration(formData);
      // Refresh registrations
      const newRegistrations = await getRegistrations();
      setRegistrations(newRegistrations);
      
      setShowForm(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving registration:', error);
      setErrors({
        form: error.message || 'Error saving registration'
      });
    }
  };
  
  const handleEditScore = (registration: CourseRegistration) => {
    setEditingScore({
      studentId: registration.studentId,
      courseId: registration.courseId,
      currentScore: registration.score
    });
    setNewScore(registration.score?.toString() || '');
  };
  
  const handleSaveScore = async () => {
    if (!editingScore) return;
    
    const score = newScore ? parseFloat(newScore) : null;
    
    if (score !== null && (score < 0 || score > 100)) {
      alert('Score must be between 0 and 100');
      return;
    }
    
    try {
      await updateRegistration(editingScore.studentId, editingScore.courseId, { score });
      
      // Update local state
      setRegistrations(registrations.map(r => 
        r.studentId === editingScore.studentId && r.courseId === editingScore.courseId
          ? { ...r, score }
          : r
      ));
      
      setEditingScore(null);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };
  
  // Get student name by ID
  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };
  
  // Get course name by ID
  const getCourseName = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown';
  };
  
  // Get teacher name by ID
  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  };
  
  // Enhanced registration for display
  const enhancedRegistrations = filteredRegistrations.map(registration => ({
    ...registration,
    studentName: getStudentName(registration.studentId),
    courseName: getCourseName(registration.courseId),
    teacherName: getTeacherName(registration.teacherId)
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Registrations</h1>
          <p className="text-gray-500">Manage student course registrations</p>
        </div>
        
        {hasPermission('create', 'registration') && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleAddNew}
          >
            Add New Registration
          </Button>
        )}
      </div>
      
      {showForm ? (
        <Card title="Register for a Course">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-md">
                {errors.form}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Student"
                name="studentId"
                value={formData.studentId}
                options={students.map(student => ({
                  value: student.id,
                  label: `${student.name} (${student.id})`
                }))}
                onChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}
                error={errors.studentId}
                fullWidth
                disabled={currentUser?.role === 'student'}
              />
              
              <Select
                label="Course"
                name="courseId"
                value={formData.courseId}
                options={courses.map(course => ({
                  value: course.id,
                  label: `${course.name} (${course.id})`
                }))}
                onChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
                error={errors.courseId}
                fullWidth
              />
              
              <Select
                label="Teacher"
                name="teacherId"
                value={formData.teacherId}
                options={teachers.map(teacher => ({
                  value: teacher.id,
                  label: teacher.name
                }))}
                onChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}
                error={errors.teacherId}
                fullWidth
              />
              
              <Input
                label="Registration Year"
                name="chosenYear"
                type="number"
                min={2000}
                max={2100}
                value={formData.chosenYear.toString()}
                onChange={handleFormChange}
                fullWidth
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                Register
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <div className="mb-4">
            <Input
              placeholder="Search registrations..."
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
            />
          </div>
          
          <Table
            columns={[
              { header: 'Student', accessor: 'studentName' },
              { header: 'Course', accessor: 'courseName' },
              { header: 'Teacher', accessor: 'teacherName' },
              { header: 'Year', accessor: 'chosenYear' },
              { 
                header: 'Score', 
                accessor: (registration) => {
                  if (editingScore && 
                      editingScore.studentId === registration.studentId && 
                      editingScore.courseId === registration.courseId) {
                    return (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={newScore}
                          onChange={(e) => setNewScore(e.target.value)}
                          className="w-20"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Save className="h-4 w-4" />}
                          onClick={handleSaveScore}
                        >
                          Save
                        </Button>
                      </div>
                    );
                  }
                  return registration.score !== null ? registration.score : 'Not graded';
                }
              },
              {
                header: 'Actions',
                accessor: (registration) => (
                  <div className="flex space-x-2 justify-end">
                    {hasPermission('update', 'score') && !editingScore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditScore(registration);
                        }}
                      >
                        Edit Score
                      </Button>
                    )}
                    
                    {hasPermission('delete', 'registration') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(registration);
                        }}
                        icon={<Trash2 className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
            data={enhancedRegistrations}
            keyField="studentId"
            isLoading={isLoading}
            emptyMessage="No registrations found"
          />
        </Card>
      )}
    </div>
  );
};

export default RegistrationPage;