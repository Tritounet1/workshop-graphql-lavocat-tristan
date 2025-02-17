import { gql, useSubscription } from "@apollo/client";
import PropTypes from "prop-types";
import { useEffect } from "react";

const NEW_TASK_CREATE = gql`
    subscription CommentAdded($id: ID!) {
        taskAdded(id: $id) {
            id
            title
            state
        }
    }
`;

const NEW_TASK_UPDATE = gql`
    subscription CommentAdded($id: ID!) {
        taskUpdated(id: $id) {
            id
            title
            state
        }
    }
`;

const TaskSubscription = ({ projectId, setProject }) => {
    const { data: addedData, error: addedError } = useSubscription(NEW_TASK_CREATE, {
        variables: { id: projectId },
    });
    const { data: updateData, error: updateError } = useSubscription(NEW_TASK_UPDATE, {
        variables: { id: projectId },
    });

    useEffect(() => {
        if (addedData?.taskAdded) {
            console.log("NOUVEAU COMMENTAIRE : ", addedData);
            /* TODO METTRE A JOUR LE SETPROJECT */
        }
    }, [addedData, setProject]);


    useEffect(() => {
        if (updateData?.taskUpdated) {
            console.log("COMMENTAIRE MIS A JOUR : ", updateData);
            /* TODO METTRE A JOUR LE SETPROJECT */
        }
    }, [updateData, setProject]);

    if(addedError) {
        console.error("Erreur de subscription (ajout de tâche) :", addedError);
    }
    if(updateError) {
        console.error("Erreur de subscription (mise à jour de tâche) :", updateError);
    }

    return null;
};

TaskSubscription.propTypes = {
    projectId: PropTypes.number.isRequired,
    setProject: PropTypes.func.isRequired,
};

export default TaskSubscription;
