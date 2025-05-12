// Core entity types
export type Sex = 'male' | 'female';

export interface Student {
  id: string;
  name: string;
  sex: Sex;
  entranceAge: number;
  entranceYear: number;
  class: string;
}

export interface Course {
  id: string;
  name: string;
  teacherId: string;
  credit: number;
  grade: number;
  canceledYear: number | null;
}

export interface Teacher {
  id: string;
  name: string;
  courses: string[]; // Course IDs that teacher can teach
}

export interface CourseRegistration {
  studentId: string;
  courseId: string;
  teacherId: string;
  chosenYear: number;
  score: number | null;
}

// User roles and authentication types
export type UserRole = 'student' | 'teacher' | 'administrator';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  entityId: string; // References student, teacher, or admin ID
}

// Statistics and reporting types
export interface ScoreStatistics {
  average: number;
  highest: number;
  lowest: number;
  passingRate: number;
}

// Filter types for queries
export interface StudentFilter {
  id?: string;
  name?: string;
  class?: string;
  entranceYear?: number;
}

export interface CourseFilter {
  id?: string;
  name?: string;
  teacherId?: string;
  grade?: number;
}

export interface TeacherFilter {
  id?: string;
  name?: string;
  courseId?: string;
}

export interface RegistrationFilter {
  studentId?: string;
  courseId?: string;
  teacherId?: string;
  chosenYear?: number;
}