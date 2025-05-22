import React, { useState } from 'react';

type TeacherFormProps = {
  onSubmit: (teacherData: { id?: string; name: string }) => void;
  initialData?: { id?: string; name: string };
};

const TeacherForm: React.FC<TeacherFormProps> = ({ onSubmit, initialData }) => {
  const [id, setId] = useState(initialData?.id || '');
  const [name, setName] = useState(initialData?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: id || undefined, name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ID (optional)</label>
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
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save
      </button>
    </form>
  );
};

export default TeacherForm;