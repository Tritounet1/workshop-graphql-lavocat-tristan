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

const NEW_PROJECT_DELETED = gql`
    subscription {
        projectDeleted
    }
`;

const ProjectSubscription = ({ setProjects }) => {
    const { data: addedData, error: addedError } = useSubscription(NEW_PROJECT_CREATE);
    const { data: deletedData, error: deletedError } = useSubscription(NEW_PROJECT_DELETED);

    useEffect(() => {
        if (addedData?.projectAdded) {
            setProjects((prevProjects) => [...prevProjects, addedData.projectAdded]);
        }
    }, [addedData, setProjects]);

    useEffect(() => {
        if (deletedData?.projectDeleted) {
            setProjects((prevProjects) =>
                prevProjects.filter((project) => project.id !== deletedData.projectDeleted)
            );
        }
    }, [deletedData, setProjects]);

    if (addedError) {
        console.error("Erreur de subscription (ajout de projet) :", addedError);
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
