import React, { useState } from 'react';

type EnrollmentFormProps = {
  onSubmit: (enrollmentData: { studentId: string; courseId: string; teacherId: string; chosenYear: number }) => void;
  initialData?: { studentId: string; courseId: string; teacherId: string; chosenYear: number };
};

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSubmit, initialData }) => {
  const [studentId, setStudentId] = useState(initialData?.studentId || '');
  const [courseId, setCourseId] = useState(initialData?.courseId || '');
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || '');
  const [chosenYear, setChosenYear] = useState(initialData?.chosenYear || new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ studentId, courseId, teacherId, chosenYear });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Student ID</label>
        <input
          type="text"
          className="form-input mt-1 block w-full"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Course ID</label>
        <input
          type="text"
          className="form-input mt-1 block w-full"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Teacher ID</label>
        <input
          type="text"
          className="form-input mt-1 block w-full"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <input
          type="number"
          className="form-input mt-1 block w-full"
          value={chosenYear}
          onChange={(e) => setChosenYear(Number(e.target.value))}
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save
      </button>
    </form>
  );
};

export default EnrollmentForm;