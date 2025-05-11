import React from 'react';
import Dashboard from '../pages/Dashboard';
import StudentPage from '../pages/StudentPage';
import CoursePage from '../pages/CoursePage';
import TeacherPage from '../pages/TeacherPage';
import RegistrationPage from '../pages/RegistrationPage';
import StatisticsPage from '../pages/StatisticsPage';

interface MainContentProps {
  currentPath: string;
}

const MainContent: React.FC<MainContentProps> = ({ currentPath }) => {
  switch (currentPath) {
    case '/':
      return <Dashboard />;
    case '/students':
      return <StudentPage />;
    case '/courses':
      return <CoursePage />;
    case '/teachers':
      return <TeacherPage />;
    case '/registration':
      return <RegistrationPage />;
    case '/statistics':
      return <StatisticsPage />;
    default:
      return <Dashboard />;
  }
};

export default MainContent;