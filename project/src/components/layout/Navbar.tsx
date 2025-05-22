import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { School, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';

  return (
    <nav className="bg-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMobileMenu}>
              <School className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-lg">CMS</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/students" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Students
              </Link>
              <Link to="/courses" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Courses
              </Link>
              <Link to="/teachers" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Teachers
              </Link>
              <Link to="/enrollments" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Enrollments
              </Link>
              <Link to="/my-courses" className="text-gray-700 hover:text-gray-900">
                My Courses
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <div className="flex items-center">
              <span className="text-white mr-4 text-sm">
                <User className="inline-block h-4 w-4 mr-1" />
                {user?.username} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link 
            to="/students" 
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMobileMenu}
          >
            Students
          </Link>
          <Link 
            to="/courses" 
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMobileMenu}
          >
            Courses
          </Link>
          <Link 
            to="/teachers" 
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMobileMenu}
          >
            Teachers
          </Link>
          <Link 
            to="/enrollments" 
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMobileMenu}
          >
            Enrollments
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-blue-700">
          <div className="px-4 flex items-center">
            <div className="text-white text-sm font-medium">
              <User className="inline-block h-4 w-4 mr-1" />
              {user?.username} ({user?.role})
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <button
              onClick={handleLogout}
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              <LogOut className="inline-block h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;