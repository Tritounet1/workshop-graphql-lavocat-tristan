import {Comment} from "../types";
import {client} from "../client";

const COMMENT_ADDED_EVENT = "commentAdded";

const getComments = async () => {
    try {
        const result = await client.query('SELECT * FROM Comment');
        const formattedResult = result.rows.map( async(row: Comment) => ({
            id: row.id,
            text: row.text,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

export const createComment = async (text: string, project: number, author: number) => {
    try {
        const query = 'INSERT INTO Comment(author_id, text, project_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [author, text, project];
        const result = await client.query(query, values);
        const formattedResult = {
            id: result.rows[0].id,
            text: result.rows[0].text,
        }
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

export const commentQueries = {
    comments: () => getComments(),
};

export const CommentMutation = {
    createComment: async (_parent: any, args: { text: string, project: number }, context: any) => {
        try {
            const { text, project } = args
            const comment = await createComment(text, project, context.user.id);
            if(comment) {
                context.pubsub.publish(COMMENT_ADDED_EVENT, comment);
            }
            return comment;
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return null;
        }
    },
}

export const CommentSubscription = {
    commentAdded: {
        subscribe: (_parent: any, _args: any, context: any) => {
            return context.pubsub.asyncIterableIterator(COMMENT_ADDED_EVENT);
        },
        resolve: (payload: Comment) => {
            return payload;
        },
    },
}