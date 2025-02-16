import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { useEffect, useState } from 'react';
import ProjectModal from "../components/ProjectModal.jsx";
import {getProjects} from "../services/api.js";

const SUBSCRIPTIONS = ["PROJECT_CREATE", "PROJECT_DELETE"];

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getProjects();
      setProjects(result || []);
    };
    fetchProjects();
  }, []);

  return (
      <div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Projets</h2>
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Nouveau Projet
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Rechercher un projet..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="block hover:no-underline">
                <ProjectCard project={project} />
              </Link>
          ))}
        </div>

        {isModalOpen && (
          <ProjectModal setIsModalOpen={setIsModalOpen} />
        )}
      </div>
  );
};