import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type DashboardCardProps = {
  title: string;
  count: number;
  icon: ReactNode;
  linkTo: string;
  color: string;
};

const DashboardCard = ({ title, count, icon, linkTo, color }: DashboardCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${color}`}>
      <Link to={linkTo} className="block hover:bg-gray-50 transition-colors">
        <div className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{count}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
          </div>
          <p className="mt-4 text-sm text-blue-800 font-medium">View all →</p>
        </div>
      </Link>
    </div>
  );
};

export default DashboardCard;