import { Link, useParams } from 'react-router-dom';
import { TaskItem } from '../components/TaskItem';
import { CommentList } from '../components/CommentList';
import { PlusCircle, CheckSquare, MessageSquare, ArrowLeft, Calendar } from 'lucide-react';
import { useEffect, useState } from "react";
import {getProjectDetails, getTaskByState, getUserInfo} from "../services/api.js";
import TaskModal from "../components/TaskModal.jsx";
import CommentModal from "../components/CommentModal.jsx";
import CommentSubscription from "../Subscriptions/CommentSubcription.jsx";
import TaskSubscription from "../Subscriptions/TaskSubscription.jsx";

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [taskState, setTaskState] = useState("NO_FILTER");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);

  const fetchProjectDetails = async () => {
    const projectDetails = await getProjectDetails(projectId);
    setProject(projectDetails);
    setLoading(false);
  };

  const setTasksByState = async (state) => {
    if(state === "NO_FILTER") {
      await fetchProjectDetails();
      return;
    }
    setTaskState(state);
    const result = await getTaskByState(Number(projectId), state);
    setProject(prev => ({ ...prev, tasks: result || [] }));
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    const userDetails = getUserInfo();
    setUserRole(userDetails.role);
    setUserId(userDetails.id);
  }, [])

  const handleAddTask = () => setIsTaskModalOpen(true);
  const handleAddComment = () => setIsCommentModalOpen(true);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
      <div>
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Link>
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">Tâches</h3>
              </div>
              <div className="flex space-x-3">
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                    value={taskState}
                    onChange={(e) => setTasksByState(e.target.value)}
                >
                  <option value="NO_FILTER">Filtres</option>
                  <option value="TO_DO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminé</option>
                </select>
                <button
                    onClick={handleAddTask}
                    className="inline-flex items-center px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter une tâche
                </button>
              </div>
            </div>
            <ul className="space-y-3">
              {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                      <li key={task.id}>
                        <TaskItem task={task}  userId={userId} userRole={userRole} />
                      </li>
                  ))
              ) : <p>Aucune tâche disponible.</p>}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">Commentaires</h3>
              </div>
              <button
                  onClick={handleAddComment}
                  className="inline-flex items-center px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un commentaire
              </button>
            </div>
            {project.comments && project.comments.length > 0 ? (
                <CommentList userRole={userRole} comments={project.comments} />
            ) : <p>Aucun commentaire pour ce projet.</p>}
          </div>
        </div>
        {isTaskModalOpen && <TaskModal projectId={Number(projectId)} setIsModalOpen={setIsTaskModalOpen} />}
        {isCommentModalOpen && <CommentModal projectId={Number(projectId)} setIsModalOpen={setIsCommentModalOpen} />}
        <CommentSubscription projectId={Number(projectId)} setProject={setProject} />
        <TaskSubscription projectId={Number(projectId)} setProject={setProject} />
      </div>
  );
};