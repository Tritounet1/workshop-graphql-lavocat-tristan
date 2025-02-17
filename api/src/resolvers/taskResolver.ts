import { client } from "../client";
import {Task, TaskState} from "../types";

const getTasks = async () => {
    try {
        const result = await client.query('SELECT * FROM Task');
        const formattedResult = result.rows.map((row: Task) => ({
            id: row.id,
            title: row.title,
            state: row.state,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

export const taskQueries = {
    tasks: () => getTasks(),
};

export const createTask: (title: string, project: number) => Promise<{
    id: number;
    title: string;
    state: TaskState;
} | null> = async (title: string, project: number) => {
    try {
        /* TODO ENREGISTER LE TASK DANS LE PROJECT */
        const query = 'INSERT INTO Task(title, state, project_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [title, 'TO_DO', project];
        const result = await client.query(query, values);
        console.log(result.rows[0]);
        return {
            id: result.rows[0].id,
            title: result.rows[0].title,
            state: result.rows[0].state,
        }
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

const updateTaskState = async (id: number, state: string) => {
    try {
        const query = 'UPDATE Task SET state = $2 WHERE id = $1 RETURNING *';
        const values = [id, state];
        const result = await client.query(query, values);
        return {
            id: result.rows[0].id,
            title: result.rows[0].title,
            state: result.rows[0].state,
        }
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
};


export const taskMutation = {
    createTask: async (_parent: any, args: { title: string, project: number }) => {
        try {
            const { title, project } = args
            return await createTask(title, project);
        } catch (error) {
            console.error("Erreur lors de la mutation login :", error);
            return false;
        }
    },
    updateTaskState: async (_parent: any, args: { id: number, state: string }) => {
        try {
            const { id, state } = args
            console.log(id, "  ", state);
            return await updateTaskState(id, state);
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return false;
        }
    },
};