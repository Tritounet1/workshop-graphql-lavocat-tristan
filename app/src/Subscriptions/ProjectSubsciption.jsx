import { gql, useSubscription } from "@apollo/client";
import PropTypes from "prop-types";
import { useEffect } from "react";

const NEW_PROJECT_CREATE = gql`
    subscription {
        projectAdded {
            id
            name
            description
            createdAt
            lastUpdate
            owner {
                id
                email
                role
            }
        }
    }
`;

export const PROJECT_UPDATED = gql`
    subscription {
        projectUpdated {
            id
            name
            description
            createdAt
            lastUpdate
            owner {
                id
                email
                role
            }
        }
    }
`;

export const PROJECT_DELETED = gql`
    subscription {
        projectDeleted
    }
`;

const ProjectSubscription = ({ setProjects }) => {
    const { data: addedData, error: addedError } = useSubscription(NEW_PROJECT_CREATE);
    const { data: updatedData, error: updatedError } = useSubscription(PROJECT_UPDATED);
    const { data: deletedData, error: deletedError } = useSubscription(PROJECT_DELETED);

    useEffect(() => {
        if (addedData?.projectAdded) {
            setProjects((prevProjects) => [...prevProjects, addedData.projectAdded]);
        }
    }, [addedData, setProjects]);

    useEffect(() => {
        if (updatedData?.projectUpdated) {
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === updatedData.projectUpdated.id ? updatedData.projectUpdated : project
                )
            );
        }
    }, [updatedData, setProjects]);

    useEffect(() => {
        if (deletedData?.projectDeleted) {
            setProjects((prevProjects) =>
                prevProjects.filter((project) => project.id !== deletedData.projectDeleted.id)
            );
        }
    }, [deletedData, setProjects]);

    if (addedError) {
        console.error("Erreur de subscription (ajout de projet) :", addedError);
    }
    if (updatedError) {
        console.error("Erreur de subscription (mise à jour de projet) :", updatedError);
    }
    if (deletedError) {
        console.error("Erreur de subscription (suppression de projet) :", deletedError);
    }

    return null;
};

ProjectSubscription.propTypes = {
    setProjects: PropTypes.func.isRequired,
};

export default ProjectSubscription;
