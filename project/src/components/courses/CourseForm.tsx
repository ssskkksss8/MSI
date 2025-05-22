import React, { useState } from 'react';

type CourseFormProps = {
  onSubmit: (courseData: { id?: string; name: string; credit: number; grade: string; canceledYear?: number }) => void;
  initialData?: { id?: string; name: string; credit: number; grade: string; canceledYear?: number };
};

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, initialData }) => {
  const [id, setId] = useState(initialData?.id || '');
  const [name, setName] = useState(initialData?.name || '');
  const [credit, setCredit] = useState(initialData?.credit || 0);
  const [grade, setGrade] = useState(initialData?.grade || '');
  const [canceledYear, setCanceledYear] = useState(initialData?.canceledYear || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: id || undefined, name, credit, grade, canceledYear: canceledYear ? Number(canceledYear) : undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ID</label>
        <input
          type="text"
          className="form-input mt-1 block w-full"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="form-input mt-1 block w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Credit</label>
        <input
          type="number"
          className="form-input mt-1 block w-full"
          value={credit}
          onChange={(e) => setCredit(Number(e.target.value))}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Grade</label>
        <input
          type="text"
          className="form-input mt-1 block w-full"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Canceled Year (optional)</label>
        <input
          type="number"
          className="form-input mt-1 block w-full"
          value={canceledYear}
          onChange={(e) => setCanceledYear(e.target.value)}
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

export default CourseForm;