import { gql, useSubscription } from "@apollo/client";
import PropTypes from "prop-types";
import { useEffect } from "react";

const NEW_COMMENT_CREATE = gql`
    subscription CommentAdded($id: ID!) {
        commentAdded(id: $id) {
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
        variables: { id: projectId },
    });

    useEffect(() => {
        if (addedData?.commentAdded) {
            console.log("NOUVEAU COMMENTAIRE : ", addedData);
            /* TODO METTRE A JOUR LE SETPROJECT */
            /*
            setProject((prevProject) => ({
                ...prevProject,
                comments: [...prevProject.comments, addedData.commentAdded],
            }));
             */
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
