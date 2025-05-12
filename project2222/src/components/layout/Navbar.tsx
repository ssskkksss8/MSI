import React from 'react';
import { School, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="flex h-16 items-center px-4 md:px-6">
        <button
          className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center">
          <School className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-semibold">Student IMS</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {currentUser ? (
            <>
              <div className="hidden md:flex items-center">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 h-8 w-8 text-blue-600">
                  <User className="h-4 w-4" />
                </span>
                <div className="ml-2">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                icon={<LogOut className="h-4 w-4" />}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="primary"
              size="sm"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;