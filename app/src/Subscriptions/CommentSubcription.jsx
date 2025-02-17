import { gql, useSubscription } from "@apollo/client";
import PropTypes from "prop-types";
import { useEffect } from "react";

const NEW_COMMENT_CREATE = gql`
    subscription CommentAdded($project: ID!) {
        commentAdded(project: $project) {
            id
            text
            author {
                id
                email
                role
            }
        }
    }
`;

const CommentSubscription = ({ projectId, setProject }) => {
    const { data: addedData, error: addedError } = useSubscription(NEW_COMMENT_CREATE, {
        variables: { project: projectId },
    });

    useEffect(() => {
        if (addedData?.commentAdded) {
            setProject((prevProject) => ({
                ...prevProject,
                comments: [...prevProject.comments, addedData.commentAdded],
            }));
        }
    }, [addedData, setProject]);

    if (addedError) {
        console.error("Erreur de subscription (ajout de commentaire) :", addedError);
    }

    return null;
};

CommentSubscription.propTypes = {
    projectId: PropTypes.number.isRequired,
    setProject: PropTypes.func.isRequired,
};

export default CommentSubscription;
