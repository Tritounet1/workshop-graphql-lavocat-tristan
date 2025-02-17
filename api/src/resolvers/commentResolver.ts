import { client } from "../client";
import {Comment} from "../types";

const getComments = async () => {
    try {
        const result = await client.query('SELECT * FROM Comment');
        const formattedResult = result.rows.map((row: Comment) => ({
            id: row.id,
            author: row.author_id,
            text: row.text,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

export const createComment = async (text: string, project: number) => {
    try {
        const author = 1; /* TODO RECUPERER L'USER AVEC LE TOWEN JWT */
        const query = 'INSERT INTO Comment(author_id, text, project_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [author, text, project];
        const result = await client.query(query, values);
        console.log(result.rows[0]);
        const formattedResult = {
            id: result.rows[0].id,
            author: result.rows[0].author,
            text: result.rows[0].text,
            project: result.rows[0].project,
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
    createComment: async (_parent: any, args: { text: string, project: number }) => {
        try {
            const { text, project } = args
            return await createComment(text, project);
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return null;
        }
    },
}