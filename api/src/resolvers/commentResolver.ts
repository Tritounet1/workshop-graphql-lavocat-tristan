import { client } from "../app";
import { User, Comment } from "../types";

const getComments = async () => {
    try {
        const result = await client.query('SELECT * FROM Comment');
        const formattedResult = result.rows.map((row: Comment) => ({
            id: row.id,
            user: row.user,
            text: row.text,
            idProject: row.idProject,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const createComment = async (user: User, text: string, idProject: number) => {
    try {
        const result = await client.query(`INSERT INTO Task(user, text, idProject) VALUES (${user}, ${text}), ${idProject}`);
        return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const commentResolver = {
    comments: () => getComments(),
};
