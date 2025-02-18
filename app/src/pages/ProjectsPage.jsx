import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { useEffect, useState } from 'react';
import ProjectModal from "../components/ProjectModal.jsx";
import {getProjectsWithOffset, getSearchProjects} from "../services/api.js";
import ProjectSubscription from "../Subscriptions/ProjectSubsciption.jsx";

export const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState({ offset: 0, limit: 3 });
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const searchProjects = async(keyword) => {
        const result = await getSearchProjects(keyword);
        console.log("KEYWORD : ", keyword);
        setProjects(result || []);
    }

    useEffect(() => {
        const fetchFilterProjects = async () => {
            const result = await getProjectsWithOffset(filter.offset, filter.limit);
            setProjects(result || []);
        };
        fetchFilterProjects();
    }, [filter]);

    return (
        <div>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mes Projets</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
                        >
                            <Filter className="h-5 w-5 mr-2" />
                            Filtres
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Nouveau Projet
                        </button>
                    </div>
                </div>
                {isFilterMenuOpen && (
                    <div className="mb-4 p-4 bg-white border rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Offset : {filter.offset}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter((prev) => ({ ...prev, offset: Math.max(prev.offset - 1, 0) }))}
                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => setFilter((prev) => ({ ...prev, offset: prev.offset + 1 }))}
                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Limit : {filter.limit}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter((prev) => ({ ...prev, limit: Math.max(prev.limit - 1, 1) }))}
                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => setFilter((prev) => ({ ...prev, limit: prev.limit + 1 }))}
                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        onChange={(event) => {searchProjects(event.target.value);}}
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
            <ProjectSubscription setProjects={setProjects} />
            {isModalOpen && <ProjectModal setIsModalOpen={setIsModalOpen} />}
        </div>
    );
};
