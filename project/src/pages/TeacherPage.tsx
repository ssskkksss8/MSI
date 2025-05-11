import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { getTeachers, getCourses, createTeacher, updateTeacher, deleteTeacher } from '../services/api';
import { Teacher, Course } from '../types';
import { useAuth } from '../context/AuthContext';

const TeacherPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    name: '',
    courses: [],
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [teachersData, coursesData] = await Promise.all([
        getTeachers(),
        getCourses()
      ]);
      setTeachers(teachersData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.id.includes(searchTerm)
  );
  
  const resetForm = () => {
    setFormData({
      name: '',
      courses: [],
    });
    setErrors({});
    setCurrentTeacher(null);
  };
  
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleEdit = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      courses: teacher.courses,
    });
    setShowForm(true);
  };
  
  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Are you sure you want to delete ${teacher.name}?`)) return;
    
    try {
      await deleteTeacher(teacher.id);
      setTeachers(teachers.filter(t => t.id !== teacher.id));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleCourseChange = (courseId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          courses: [...prev.courses, courseId]
        };
      } else {
        return {
          ...prev,
          courses: prev.courses.filter(id => id !== courseId)
        };
      }
    });
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Teacher name is required';
    }
    
    if (formData.courses.length === 0) {
      newErrors.courses = 'At least one course must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (currentTeacher) {
        // Update existing teacher
        const updated = await updateTeacher(currentTeacher.id, formData);
        setTeachers(teachers.map(t => t.id === currentTeacher.id ? updated : t));
      } else {
        // Create new teacher
        const created = await createTeacher(formData);
        setTeachers([...teachers, created]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };
  
  // Get course names for a teacher
  const getTeacherCourses = (courseIds: string[]): string => {
    return courseIds
      .map(id => courses.find(c => c.id === id)?.name || id)
      .join(', ');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-gray-500">Manage teacher information</p>
        </div>
        
        {hasPermission('create', 'teacher') && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleAddNew}
          >
            Add New Teacher
          </Button>
        )}
      </div>
      
      {showForm ? (
        <Card title={currentTeacher ? "Edit Teacher" : "Add New Teacher"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Teacher Name"
                name="name"
                placeholder="Enter teacher's full name"
                value={formData.name}
                onChange={handleFormChange}
                error={errors.name}
                fullWidth
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Courses
                </label>
                {errors.courses && (
                  <p className="mt-1 text-sm text-rose-500 mb-2">{errors.courses}</p>
                )}
                <div className="bg-white border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {courses.map(course => (
                      <label key={course.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={formData.courses.includes(course.id)}
                          onChange={(e) => handleCourseChange(course.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{course.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
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
                {currentTeacher ? 'Update Teacher' : 'Create Teacher'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <div className="mb-4">
            <Input
              placeholder="Search teachers..."
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
            />
          </div>
          
          <Table
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Name', accessor: 'name' },
              { header: 'Courses', accessor: (teacher) => getTeacherCourses(teacher.courses) },
              {
                header: 'Actions',
                accessor: (teacher) => (
                  <div className="flex space-x-2 justify-end">
                    {hasPermission('update', 'teacher') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(teacher);
                        }}
                        icon={<Edit className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                    )}
                    
                    {hasPermission('delete', 'teacher') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(teacher);
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
            data={filteredTeachers}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="No teachers found"
          />
        </Card>
      )}
    </div>
  );
};

export default TeacherPage;