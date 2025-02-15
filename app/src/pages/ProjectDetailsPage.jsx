import { Link, useParams } from 'react-router-dom';
import {TaskItem} from '../components/TaskItem';
import {CommentList} from '../components/CommentList';
import { PlusCircle, CheckSquare, MessageSquare, ArrowLeft, Calendar } from 'lucide-react';
import {useEffect, useState} from "react";
import {
  getCommentsByProjectId,
  getProjectById,
  getTasksByProjectId,
  getUserEmailById
} from "../services/api.js";
import TaskModal from "../components/TaskModal.jsx";
import CommentModal from "../components/CommentModal.jsx";

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  useEffect(() => {
    getProjectById(projectId).then((projectDetails) => {
      getCommentsByProjectId(projectId).then((comments) => {
        const commentsWithEmails = comments
            ? Promise.all(
                comments.map((comment) =>
                    getUserEmailById(comment.author).then((email) => ({
                      id: comment.id,
                      author: { email },
                      text: comment.text,
                    }))
                )
            )
            : Promise.resolve([]);
        commentsWithEmails.then((resolvedComments) => {
          getTasksByProjectId(projectId).then((tasks) => {
            const tasksProperly = tasks
                ? tasks.map((task) => ({
                  id: task.id,
                  title: task.title,
                  state: task.state,
                }))
                : [];

            setProject({
              ...projectDetails,
              tasks: tasksProperly,
              comments: resolvedComments,
            });
            setLoading(false);
          });
        });
      });
    });
  }, [projectId]);

  const handleAddTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleAddComment = () => {
    setIsCommentModalOpen(true);
  };

  if(loading) {
    return <p> Chargement... </p>;
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
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
                day: '2-digit',
                month: 'short',
                year: 'numeric',
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
            <button
              onClick={handleAddTask}
              className="inline-flex items-center px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une tâche
            </button>
          </div>
          <ul className="space-y-3">
            {project.tasks && project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                    <li key={task.id}>
                      <TaskItem task={task} />
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
              <CommentList comments={project.comments} />
          ) : <p>Aucun commentaire pour ce projet.</p>}
        </div>
      </div>
      {isTaskModalOpen && (
          <TaskModal projectId={Number(projectId)} setIsModalOpen={setIsTaskModalOpen} />
      )}
      {isCommentModalOpen && (
          <CommentModal authorId={1} projectId={Number(projectId)} setIsModalOpen={setIsCommentModalOpen} />
      )}
    </div>
  );
};