import { client } from "../app";
import {Task} from "../types";

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

const getTask = async (id: number) => {
    try {
        const query = 'SELECT * FROM Task WHERE project = $1';
        const values = [id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return null;
        }
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
        throw new Error('Impossible de récupérer le projet');
    }
};

export const taskResolver = {
    tasks: () => getTasks(),
    task: ({ id }: { id: string | number }) => getTask(Number(id)),
};

const createTask = async (title: string, project: number) => {
    try {
        const query = 'INSERT INTO Task(title, state, project) VALUES ($1, $2, $3)';
        const values = [title, 'IN_PROGRESS', project];
        const result = await client.query(query, values);
        console.log(result);
        if(result) {
            return true;
        }
        return false;
        // return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}


const deleteTask = async (id: number) => {    try {
    const query = 'DELETE FROM Project WHERE id = $1';
    const values = [id];
    const result = await client.query(query, values);

    if(result) {
        return true;
    }
    return false;
} catch (err) {
    console.error('Erreur lors de la requête :', err);
    throw new Error('Impossible de récupérer le projet');
}
}

const updateTaskState = async (id: number, state: string) => {
    try {
        const query = 'UPDATE Task SET state = $2 WHERE id = $1';
        const values = [id, state];
        const result = await client.query(query, values);

        console.log(result);
        if(result) {
            return true;
        }
        return false;
        // return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return false;
    }
};


export const createTaskMutation = {
    createTask: async ({ title, project }: { title: string, project: number }) => {
        try {
            const result = await createTask(title, project);
            if (result) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.error("Erreur lors de la mutation login :", error);
            return false;
        }
    },
    updateTaskState: async ({ id, state } : { id: number, state: string }) => {
        try {
            const result = await updateTaskState(id, state);
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
    deleteTask: async ({ id } : { id: number }) => {
        try {
            const result = await deleteTask(id);
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
    }
};