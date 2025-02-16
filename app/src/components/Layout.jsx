import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Briefcase } from 'lucide-react';
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/api.js";

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", role: "" });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    getUserInfo().then((user) => {
      setFormData(user);
    });
  }, []);

  return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                  <span className="text-xl font-semibold text-gray-900">
                  ProjectHub
                </span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                    Projets
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formData.email}</p>
                  <p className="text-xs text-gray-500">{formData.role}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};
