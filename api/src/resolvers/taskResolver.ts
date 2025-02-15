import { client } from "../app";
import { Task } from "../types";

const getTasks = async () => {
    try {
        const result = await client.query('SELECT * FROM Task');
        const formattedResult = result.rows.map((row: Task) => ({
            id: row.id,
            title: row.title,
            state: row.state,
            project: row.project,
        }));
        console.log(formattedResult);
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const createTask = async (name: string, state: string, idProject: number) => {
    try {
        const result = await client.query(`INSERT INTO Task(name, state, idProject) VALUES (${name}, ${state}, ${idProject})`);
        return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const taskResolver = {
    tasks: () => getTasks(),
};
