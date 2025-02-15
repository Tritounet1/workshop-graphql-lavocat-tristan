import { client } from "../app";
import { User, Comment } from "../types";

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

const createComment = async (author: User, text: string, project: number) => {
    try {
        const result = await client.query(`INSERT INTO Task(author, text, project) VALUES (${author}, ${text}), ${project}`);
        return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const commentResolver = {
    comments: () => getComments(),
};
