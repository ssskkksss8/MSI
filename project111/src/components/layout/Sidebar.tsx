import React from 'react';
import { Home, Users, GraduationCap, UserCheck, BookOpen, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Array<'student' | 'teacher' | 'administrator'>;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <Home className="h-5 w-5" />,
    roles: ['student', 'teacher', 'administrator'],
  },
  {
    label: 'Students',
    path: '/students',
    icon: <Users className="h-5 w-5" />,
    roles: ['teacher', 'administrator'],
  },
  {
    label: 'Courses',
    path: '/courses',
    icon: <BookOpen className="h-5 w-5" />,
    roles: ['student', 'teacher', 'administrator'],
  },
  {
    label: 'Teachers',
    path: '/teachers',
    icon: <UserCheck className="h-5 w-5" />,
    roles: ['administrator'],
  },
  {
    label: 'Course Registration',
    path: '/registration',
    icon: <GraduationCap className="h-5 w-5" />,
    roles: ['student', 'teacher', 'administrator'],
  },
  {
    label: 'Statistics',
    path: '/statistics',
    icon: <BarChart2 className="h-5 w-5" />,
    roles: ['student', 'teacher', 'administrator'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentPath }) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || 'student';
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole as any));

  // Close the sidebar when clicking outside on mobile
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <nav className="flex flex-col h-full py-4">
          <div className="px-4 mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </h2>
          </div>
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`
                    flex items-center w-full px-3 py-2 text-sm font-medium rounded-md 
                    transition-colors duration-150 hover:bg-gray-100
                    ${currentPath === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                  `}
                  onClick={() => {
                    onNavigate(item.path);
                    onClose();
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;