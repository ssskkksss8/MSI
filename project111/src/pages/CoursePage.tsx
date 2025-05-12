import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { getCourses, getTeachers, createCourse, updateCourse, deleteCourse } from '../services/api';
import { Course, Teacher } from '../types';
import { useAuth } from '../context/AuthContext';

const CoursePage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    name: '',
    teacherId: '',
    credit: 1,
    grade: 1,
    canceledYear: null,
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, teachersData] = await Promise.all([
        getCourses(),
        getTeachers()
      ]);
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
  
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setFormData({
      name: '',
      teacherId: '',
      credit: 1,
      grade: 1,
      canceledYear: null,
    });
    setErrors({});
    setCurrentCourse(null);
  };
  
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleEdit = (course: Course) => {
    setCurrentCourse(course);
    setFormData({
      name: course.name,
      teacherId: course.teacherId,
      credit: course.credit,
      grade: course.grade,
      canceledYear: course.canceledYear,
    });
    setShowForm(true);
  };
  
  const handleDelete = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete ${course.name}?`)) return;
    
    try {
      await deleteCourse(course.id);
      setCourses(courses.filter(c => c.id !== course.id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'canceledYear') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['credit', 'grade'].includes(name) ? parseInt(value) : value
      }));
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }
    
    if (!formData.teacherId) {
      newErrors.teacherId = 'Teacher is required';
    }
    
    if (formData.credit < 1 || formData.credit > 10) {
      newErrors.credit = 'Credit must be between 1 and 10';
    }
    
    if (formData.grade < 1 || formData.grade > 4) {
      newErrors.grade = 'Grade must be between 1 and 4';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (currentCourse) {
        // Update existing course
        const updated = await updateCourse(currentCourse.id, formData);
        setCourses(courses.map(c => c.id === currentCourse.id ? updated : c));
      } else {
        // Create new course
        const created = await createCourse(formData);
        setCourses([...courses, created]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };
  
  // Get teacher name by ID
  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-gray-500">Manage course information</p>
        </div>
        
        {hasPermission('create', 'course') && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleAddNew}
          >
            Add New Course
          </Button>
        )}
      </div>
      
      {showForm ? (
        <Card title={currentCourse ? "Edit Course" : "Add New Course"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course Name"
                name="name"
                placeholder="Enter course name"
                value={formData.name}
                onChange={handleFormChange}
                error={errors.name}
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
                label="Credit Hours"
                name="credit"
                type="number"
                min={1}
                max={10}
                value={formData.credit.toString()}
                onChange={handleFormChange}
                error={errors.credit}
                fullWidth
              />
              
              <Input
                label="Grade Requirement"
                name="grade"
                type="number"
                min={1}
                max={4}
                value={formData.grade.toString()}
                onChange={handleFormChange}
                error={errors.grade}
                fullWidth
              />
              
              <Input
                label="Canceled Year (optional)"
                name="canceledYear"
                type="number"
                min={2000}
                max={2100}
                placeholder="Leave empty if active"
                value={formData.canceledYear?.toString() || ''}
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
                {currentCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <div className="mb-4">
            <Input
              placeholder="Search courses..."
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
            />
          </div>
          
          <Table
            columns={[
              { header: 'Course ID', accessor: 'id' },
              { header: 'Course Name', accessor: 'name' },
              { header: 'Teacher', accessor: (course) => getTeacherName(course.teacherId) },
              { header: 'Credits', accessor: 'credit' },
              { header: 'Min. Grade', accessor: 'grade' },
              { 
                header: 'Status', 
                accessor: (course) => course.canceledYear 
                  ? <span className="text-rose-600">Canceled in {course.canceledYear}</span> 
                  : <span className="text-emerald-600">Active</span>
              },
              {
                header: 'Actions',
                accessor: (course) => (
                  <div className="flex space-x-2 justify-end">
                    {hasPermission('update', 'course') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(course);
                        }}
                        icon={<Edit className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                    )}
                    
                    {hasPermission('delete', 'course') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(course);
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
            data={filteredCourses}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="No courses found"
          />
        </Card>
      )}
    </div>
  );
};

export default CoursePage;