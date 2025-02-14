import { client } from "../app";
import { Task } from "../types";

const getTasks = async () => {
    try {
        const result = await client.query('SELECT * FROM Task');
        const formattedResult = result.rows.map((row: Task) => ({
            id: row.id,
            name: row.name,
            taskState: row.taskState,
            idProject: row.idProject,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const createTask = async (name: string, taskState: string, idProject: number) => {
    try {
        const result = await client.query(`INSERT INTO Task(name, taskState, idProject) VALUES (${name}, ${taskState}, ${idProject})`);
        return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const taskResolver = {
    tasks: () => getTasks(),
};
