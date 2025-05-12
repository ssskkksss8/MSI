import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Course Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Course details for ID: {id} will be implemented here</p>
      </div>
    </div>
  );
};

export default CourseDetail;