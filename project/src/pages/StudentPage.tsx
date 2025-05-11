import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';
import { Student, Sex } from '../types';
import { useAuth } from '../context/AuthContext';

const StudentPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    sex: '' as Sex,
    entranceAge: 0,
    entranceYear: new Date().getFullYear(),
    class: '',
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      sex: '' as Sex,
      entranceAge: 0,
      entranceYear: new Date().getFullYear(),
      class: '',
    });
    setErrors({});
    setCurrentStudent(null);
  };
  
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleEdit = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      id: student.id,
      name: student.name,
      sex: student.sex,
      entranceAge: student.entranceAge,
      entranceYear: student.entranceYear,
      class: student.class,
    });
    setShowForm(true);
  };
  
  const handleDelete = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}?`)) return;
    
    try {
      await deleteStudent(student.id);
      setStudents(students.filter(s => s.id !== student.id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'entranceAge' || name === 'entranceYear' ? parseInt(value) : value
    }));
    
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
      newErrors.name = 'Name is required';
    }
    
    if (!formData.sex) {
      newErrors.sex = 'Sex is required';
    }
    
    if (formData.entranceAge < 10 || formData.entranceAge > 50) {
      newErrors.entranceAge = 'Age must be between 10 and 50';
    }
    
    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (currentStudent) {
        // Update existing student
        const updated = await updateStudent(currentStudent.id, formData);
        setStudents(students.map(s => s.id === currentStudent.id ? updated : s));
      } else {
        // Create new student
        const created = await createStudent(formData);
        setStudents([...students, created]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-gray-500">Manage student information</p>
        </div>
        
        {hasPermission('create', 'student') && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleAddNew}
          >
            Add New Student
          </Button>
        )}
      </div>
      
      {showForm ? (
        <Card title={currentStudent ? "Edit Student" : "Add New Student"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="Enter student's full name"
                value={formData.name}
                onChange={handleFormChange}
                error={errors.name}
                fullWidth
              />
              
              <Select
                label="Sex"
                name="sex"
                value={formData.sex}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
                onChange={(value) => setFormData(prev => ({ ...prev, sex: value as Sex }))}
                error={errors.sex}
                fullWidth
              />
              
              <Input
                label="Entrance Age"
                name="entranceAge"
                type="number"
                min={10}
                max={50}
                value={formData.entranceAge.toString()}
                onChange={handleFormChange}
                error={errors.entranceAge}
                fullWidth
              />
              
              <Input
                label="Entrance Year"
                name="entranceYear"
                type="number"
                min={2000}
                max={2100}
                value={formData.entranceYear.toString()}
                onChange={handleFormChange}
                fullWidth
              />
              
              <Input
                label="Class"
                name="class"
                placeholder="e.g., CS-A"
                value={formData.class}
                onChange={handleFormChange}
                error={errors.class}
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
                {currentStudent ? 'Update Student' : 'Create Student'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <div className="mb-4">
            <Input
              placeholder="Search by name, ID, or class..."
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
              { header: 'Sex', accessor: 'sex', className: 'capitalize' },
              { header: 'Age at Entry', accessor: 'entranceAge' },
              { header: 'Entry Year', accessor: 'entranceYear' },
              { header: 'Class', accessor: 'class' },
              {
                header: 'Actions',
                accessor: (student) => (
                  <div className="flex space-x-2 justify-end">
                    {hasPermission('update', 'student') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(student);
                        }}
                        icon={<Edit className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                    )}
                    
                    {hasPermission('delete', 'student') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(student);
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
            data={filteredStudents}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="No students found"
          />
        </Card>
      )}
    </div>
  );
};

export default StudentPage;