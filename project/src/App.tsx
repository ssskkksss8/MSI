import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import StudentsPage from './components/students/StudentsPage';
import StudentDetail from './components/students/StudentDetail';
import CoursesPage from './components/courses/CoursesPage';
import CourseDetail from './components/courses/CourseDetail';
import TeachersPage from './components/teachers/TeachersPage';
import TeacherDetail from './components/teachers/TeacherDetail';
import EnrollmentsPage from './components/enrollments/EnrollmentsPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotFoundPage from './components/common/NotFoundPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentCoursesPage from './components/students/StudentCoursesPage';
import TeacherCoursePage from './components/teachers/TeacherCoursePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <ToastContainer position="top-right" autoClose={3000} />
          <Navbar />
          <div className="flex-grow px-4 py-6 md:px-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/students" element={
                <PrivateRoute>
                  <StudentsPage />
                </PrivateRoute>
              } />
              <Route path="/my-courses" element={
                <PrivateRoute>
                  <StudentCoursesPage />
                </PrivateRoute>
              } />
              <Route path="/students/:id" element={
                <PrivateRoute>
                  <StudentDetail />
                </PrivateRoute>
              } />
              <Route path="/courses" element={
                <PrivateRoute>
                  <CoursesPage />
                </PrivateRoute>
              } />
              <Route path="/courses/:id" element={
                <PrivateRoute>
                  <CourseDetail />
                </PrivateRoute>
              } />
              <Route path="/teachers" element={
                <PrivateRoute>
                  <TeachersPage />
                </PrivateRoute>
              } />
              <Route path="/teachers/:id" element={
                <PrivateRoute>
                  <TeacherDetail />
                </PrivateRoute>
              } />
              <Route path="/enrollments" element={
                <PrivateRoute>
                  <EnrollmentsPage />
                </PrivateRoute>
              } />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;