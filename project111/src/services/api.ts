import axios from 'axios';
import { Student, Course, Teacher, CourseChoosing } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const login = async (username: string, password: string) => {
  const response = await axios.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (studentId: string, password: string) => {
  const response = await axios.post('/auth/register', null, {
    params: { studentId, password }
  });
  return response.data;
};

// Students API
export const getStudents = async () => {
  const response = await api.get<Student[]>('/students');
  return response.data;
};

export const getStudent = async (id: string) => {
  const response = await api.get<Student>(`/students/${id}`);
  return response.data;
};

export const createStudent = async (student: Omit<Student, 'id'>) => {
  const response = await api.post<Student>('/students', student);
  return response.data;
};

export const updateStudent = async (id: string, student: Partial<Student>) => {
  const response = await api.put<Student>(`/students/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: string) => {
  await api.delete(`/students/${id}`);
};

export const searchStudents = async (name: string) => {
  const response = await api.get<Student[]>('/students/search', {
    params: { name }
  });
  return response.data;
};

// Courses API
export const getCourses = async () => {
  const response = await api.get<Course[]>('/courses');
  return response.data;
};

export const getCourse = async (id: string) => {
  const response = await api.get<Course>(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (course: Omit<Course, 'id'>) => {
  const response = await api.post<Course>('/courses', course);
  return response.data;
};

export const updateCourse = async (id: string, course: Partial<Course>) => {
  const response = await api.put<Course>(`/courses/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id: string) => {
  await api.delete(`/courses/${id}`);
};

// Teachers API
export const getTeachers = async () => {
  const response = await api.get<Teacher[]>('/teachers');
  return response.data;
};

export const getTeacher = async (id: string) => {
  const response = await api.get<Teacher>(`/teachers/${id}`);
  return response.data;
};

export const createTeacher = async (teacher: Omit<Teacher, 'id'>) => {
  const response = await api.post<Teacher>('/teachers', teacher);
  return response.data;
};

export const updateTeacher = async (id: string, teacher: Partial<Teacher>) => {
  const response = await api.put<Teacher>(`/teachers/${id}`, teacher);
  return response.data;
};

export const deleteTeacher = async (id: string) => {
  await api.delete(`/teachers/${id}`);
};

export const searchTeachers = async (name: string) => {
  const response = await api.get<Teacher[]>('/teachers/search', {
    params: { name }
  });
  return response.data;
};

// Course Choosings API
export const getCourseChoosings = async () => {
  const response = await api.get<CourseChoosing[]>('/course-choosings');
  return response.data;
};

// Registrations API
export const getRegistrations = async () => {
  const response = await api.get<CourseChoosing[]>('/registrations');
  return response.data;
};

export const createRegistration = async (registration: {
  studentId: string;
  courseId: string;
  teacherId: string;
  chosenYear: number;
  score: number | null;
}) => {
  const response = await api.post<CourseChoosing>('/registrations', registration);
  return response.data;
};

export const updateRegistration = async (
  studentId: string,
  courseId: string,
  updates: { score?: number | null }
) => {
  const response = await api.put<CourseChoosing>(
    `/registrations/${studentId}/${courseId}`,
    updates
  );
  return response.data;
};

export const deleteRegistration = async (studentId: string, courseId: string) => {
  await api.delete(`/registrations/${studentId}/${courseId}`);
};

export const createCourseChoosing = async (
  studentId: string,
  courseId: string,
  teacherId: string,
  chosenYear: number
) => {
  const response = await api.post<CourseChoosing>('/course-choosings', null, {
    params: { studentId, courseId, teacherId, chosenYear }
  });
  return response.data;
};

export const updateScore = async (id: number, score: number) => {
  const response = await api.put<CourseChoosing>(`/course-choosings/${id}/score`, null, {
    params: { score }
  });
  return response.data;
};

export const deleteCourseChoosing = async (id: number) => {
  await api.delete(`/course-choosings/${id}`);
};

export const getStudentsByCourse = async (courseId: string, year: number) => {
  const response = await api.get<Student[]>('/course-choosings/by-course', {
    params: { courseId, year }
  });
  return response.data;
};

export const getCourseAverageScore = async (courseId: string) => {
  const response = await api.get<number>('/course-choosings/average-score', {
    params: { courseId }
  });
  return response.data;
};

export const getAllStudentsAverageScore = async () => {
  const response = await api.get<number>('/registrations/average-score');
  return response.data;
};

export const filterStudentsByScore = async (
  courseId: string,
  score: number,
  greaterThan: boolean
) => {
  const response = await api.get<Student[]>('/course-choosings/filter', {
    params: { courseId, score, greaterThan }
  });
  return response.data;
};

// Add the missing getClassAverageScore function
export const getClassAverageScore = async (className: string) => {
  const response = await api.get<number>('/registrations/class-average', {
    params: { className }
  });
  return response.data;
};

export const getStudentAverageScore = async (studentId: string) => {
  const response = await api.get<number>(`/registrations/${studentId}/average`);
  return response.data;
};