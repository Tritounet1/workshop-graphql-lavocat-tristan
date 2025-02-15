import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { useEffect, useState } from 'react';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProjets = async () => {
    const client = new ApolloClient({
      uri: 'http://localhost:5050/api',
      cache: new InMemoryCache(),
    });
    try {
      const response = await client.query({
        query: gql`
          {
            projects {
              id
              name
              description
              lastUpdate
              createdAt
            }
          }
        `,
      });
      return response.data.projects;
    } catch (err) {
      console.error('Erreur dans la requête :', err);
      alert('Une erreur est survenue lors de la connexion.');
      return [];
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getProjets();
      setProjects(result || []);
    };
    fetchProjects();
  }, []);

  const handleNewProject = () => {
    const client = new ApolloClient({
      uri: 'http://localhost:5050/api',
      cache: new InMemoryCache(),
    });

    client
        .mutate({
          mutation: gql`
          mutation createProject($name: String!, $description: String!) {
            createProject(name: $name, description: $description)
          }
        `,
          variables: {
            name: formData.name,
            description: formData.description,
          },
        })
        .then((result) => {
          if (result.data.createProject) {
            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            window.location.reload();
          } else {
            alert("Erreur dans la création d'un projet.");
          }
        })
        .catch((err) => {
          console.error('Erreur dans la requête :', err);
          alert('Une erreur est survenue lors de la connexion.');
        });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
      <div>
        {/* Header et Bouton Ajouter */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Projets</h2>
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des Projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
              <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block hover:no-underline"
              >
                <ProjectCard project={project} />
              </Link>
          ))}
        </div>

        {/* Modal Dialog */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                <h3 className="text-lg font-semibold mb-4">Créer un Nouveau Projet</h3>
                {/* Formulaire */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du projet
                  </label>
                  <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nom du projet"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Description du projet"
                  ></textarea>
                </div>
                {/* Boutons */}
                <div className="flex justify-end space-x-2">
                  <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={handleNewProject}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};
