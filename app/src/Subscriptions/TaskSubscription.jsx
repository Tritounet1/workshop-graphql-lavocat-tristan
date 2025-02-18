import { gql, useSubscription } from "@apollo/client";
import PropTypes from "prop-types";
import { useEffect } from "react";

const NEW_TASK_CREATE = gql`
    subscription CommentAdded($project: ID!) {
        taskAdded(project: $project) {
            id
            title
            state
        }
    }
`;

const NEW_TASK_UPDATE = gql`
    subscription CommentAdded($project: ID!) {
        taskUpdated(project: $project) {
            id
            title
            state
        }
    }
`;

const TASK_DELETED = gql`
    subscription TaskDeleted($project: ID!) {
        taskDeleted(project: $project)
    }
`;

const TaskSubscription = ({ projectId, setProject }) => {
    const { data: addedData, error: addedError } = useSubscription(NEW_TASK_CREATE, {
        variables: { project: projectId },
    });
    const { data: updateData, error: updateError } = useSubscription(NEW_TASK_UPDATE, {
        variables: { project: projectId },
    });
    const { data: deleteData, error: deleteError } = useSubscription(TASK_DELETED, {
        variables: { project: projectId },
    });

    useEffect(() => {
        if (addedData?.taskAdded) {
            setProject((prevProject) => ({
                ...prevProject,
                tasks: [...prevProject.tasks, addedData.taskAdded],
            }));
        }
    }, [addedData, setProject]);


    useEffect(() => {
        if (updateData?.taskUpdated) {
            setProject((prevProject) => ({
                ...prevProject,
                tasks: prevProject.tasks.map((task) =>
                    task.id === updateData.taskUpdated.id ? updateData.taskUpdated : task
                ),
            }));
        }
    }, [updateData, setProject]);

    useEffect(() => {
        if (deleteData?.taskDeleted) {
            setProject((prevProject) => ({
                ...prevProject,
                tasks: prevProject.tasks.filter((task) => task.id !== deleteData.taskDeleted),
            }));
        }
    }, [deleteData, setProject]);

    if(addedError) {
        console.error("Erreur de subscription (ajout de tâche) :", addedError);
    }
    if(updateError) {
        console.error("Erreur de subscription (mise à jour de tâche) :", updateError);
    }
    if (deleteError) {
        console.error("Erreur de subscription (suppression de commentaire) :", deleteError);
    }

    return null;
};

TaskSubscription.propTypes = {
    projectId: PropTypes.number.isRequired,
    setProject: PropTypes.func.isRequired,
};

export default TaskSubscription;
