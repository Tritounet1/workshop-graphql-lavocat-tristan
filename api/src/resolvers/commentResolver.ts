import { client } from "../app";
import {Comment} from "../types";

const getComments = async () => {
    try {
        const result = await client.query('SELECT * FROM Comment');
        const formattedResult = result.rows.map((row: Comment) => ({
            id: row.id,
            author: row.author,
            text: row.text,
            project: row.project,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const getComment = async (id: number) => {
    try {
        const query = 'SELECT * FROM Comment WHERE project = $1';
        const values = [id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return null;
        }
        const formattedResult = result.rows.map((row: Comment) => ({
            id: row.id,
            author: row.author,
            text: row.text,
            project: row.project,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        throw new Error('Impossible de récupérer le projet');
    }
};

export const createComment = async (author: number, text: string, project: number) => {
    try {
        const query = 'INSERT INTO Comment(author, text, project) VALUES ($1, $2, $3)';
        const values = [author, text, project];
        const result = await client.query(query, values);
        if(result) {
            return true;
        }
        return false;
        // return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const commentResolver = {
    comments: () => getComments(),
    comment: ({ id }: { id: string | number }) => getComment(Number(id)),
};

export const CommentMutation = {
    createComment: async ({ author, text, project }: { author: number, text: string, project: number }) => {
        try {
            const result = await createComment(author, text, project);
            if (result) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return false;
        }
    },
}