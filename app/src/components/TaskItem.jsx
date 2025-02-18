import {Circle, Clock, CheckCircle2, Trash} from 'lucide-react';
import { useState } from 'react';
import PropTypes from "prop-types";
import {deleteTask, updateTaskState} from "../services/api.js";

export const TaskItem = ({ userRole, userId, task }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusConfig = {
    TO_DO: {
      icon: Circle,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      text: 'À faire',
    },
    IN_PROGRESS: {
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      text: 'En cours',
    },
    DONE: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-50',
      text: 'Terminé',
    },
  };

  const config = statusConfig[task.state];
  const StatusIcon = config.icon;

  const handleTaskStateChange = async (newState, lastState, taskId) => {
    try {
      const response = await updateTaskState(taskId, newState, lastState);

      if (response.success) {
        setIsMenuOpen(false);
      } else {
        console.error(response.error || "Erreur inconnue lors de la modification de l'état de la tâche.");
        alert(response.error || "Erreur inconnue lors de la modification de l'état de la tâche.");
      }
    } catch (error) {
      console.error("Erreur inattendue :", error);
      alert("Une erreur inattendue est survenue.");
    }
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId).then((r) => {
      if (!r.success) {
        console.log(r.error);
      }
    });
  }

  return (
      <div className="relative flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200">
        <div className="flex flex-col space-x-3">
          <div className="flex items-center space-x-3">
            <StatusIcon className={`h-5 w-5 ${config.color}`} />
            <span className="text-gray-900 font-medium">{task.title}</span>
          </div>
          {(userRole === "ADMIN" || String(userId) === String(task.authorId)) && (
              <button
                  className={"pt-4"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
              >
                <Trash />
              </button>
          )}
        </div>
        <div className="relative">
          <button
              className={`px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.color}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {config.text}
          </button>
          {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                {Object.entries(statusConfig).map(([stateKey, stateConfig]) => (
                    <button
                        key={stateKey}
                        className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                            task.state === stateKey ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => handleTaskStateChange(stateKey, task.state, task.id)}
                    >
                      <stateConfig.icon className={`h-5 w-5 ${stateConfig.color}`} />
                      <span className="ml-2">{stateConfig.text}</span>
                    </button>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

TaskItem.propTypes = {
  userRole: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  task: PropTypes.object.isRequired,
};
