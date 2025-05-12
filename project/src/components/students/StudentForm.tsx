import React, { useState } from 'react';

type Student = {
  id?: string;
  name: string;
  sex: string;
  entranceAge: number;
  entranceYear: number;
  studentClass: string;
};

type StudentFormProps = {
  initialData?: Student;
  onSubmit: (data: Student) => void;
};

const StudentForm = ({ initialData, onSubmit }: StudentFormProps) => {
  const [formData, setFormData] = useState<Student>(
    initialData || {
      id: '',
      name: '',
      sex: 'MALE',
      entranceAge: 18,
      entranceYear: new Date().getFullYear(),
      studentClass: ''
    }
  );

  const [errors, setErrors] = useState({
    id: '',
    name: '',
    entranceAge: '',
    entranceYear: '',
    studentClass: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'entranceAge' || name === 'entranceYear') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      id: '',
      name: '',
      entranceAge: '',
      entranceYear: '',
      studentClass: ''
    };

    // ID validation
    if (!formData.id) {
      newErrors.id = 'ID is required';
      valid = false;
    } else if (formData.id.length !== 10) {
      newErrors.id = 'ID must be 10 characters';
      valid = false;
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    // Entrance Age validation
    if (formData.entranceAge < 10 || formData.entranceAge > 50) {
      newErrors.entranceAge = 'Entrance age must be between 10 and 50';
      valid = false;
    }

    // Entrance Year validation
    const currentYear = new Date().getFullYear();
    if (formData.entranceYear < 1950 || formData.entranceYear > currentYear) {
      newErrors.entranceYear = `Entrance year must be between 1950 and ${currentYear}`;
      valid = false;
    }

    // Class validation
    if (!formData.studentClass) {
      newErrors.studentClass = 'Class is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="id" className="form-label">Student ID (10 characters)</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="form-input"
            disabled={!!initialData}
            maxLength={10}
          />
          {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
        </div>
        
        <div>
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="sex" className="form-label">Gender</label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="form-select"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="entranceAge" className="form-label">Entrance Age (10-50)</label>
          <input
            type="number"
            id="entranceAge"
            name="entranceAge"
            value={formData.entranceAge}
            onChange={handleChange}
            min={10}
            max={50}
            className="form-input"
          />
          {errors.entranceAge && <p className="mt-1 text-sm text-red-600">{errors.entranceAge}</p>}
        </div>

        <div>
          <label htmlFor="entranceYear" className="form-label">Entrance Year</label>
          <input
            type="number"
            id="entranceYear"
            name="entranceYear"
            value={formData.entranceYear}
            onChange={handleChange}
            className="form-input"
          />
          {errors.entranceYear && <p className="mt-1 text-sm text-red-600">{errors.entranceYear}</p>}
        </div>

        <div>
          <label htmlFor="studentClass" className="form-label">Class</label>
          <input
            type="text"
            id="studentClass"
            name="studentClass"
            value={formData.studentClass}
            onChange={handleChange}
            className="form-input"
          />
          {errors.studentClass && <p className="mt-1 text-sm text-red-600">{errors.studentClass}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
        >
          {initialData ? 'Update Student' : 'Add Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;