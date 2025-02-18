import { client } from "../client";
import { Task, TaskState} from "../types";

const TASK_ADDED_EVENT = "taskAdded";
const TASK_UPDATE_EVENT = "taskUpdated";

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

const getTasksByStatus = async (project: number, status: string) => {
    try {
        const query = 'SELECT * FROM Task WHERE state = $1 AND project_id = $2';
        const values = [status, project];
        const result = await client.query(query, values);
        console.log(result.rows)
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
    tasksByStatus: async (_parent: any, args: { project: number, status: string }) => getTasksByStatus(args.project, args.status),

};

export const createTask: (title: string, project: number) => Promise<{
    id: number;
    title: string;
    state: TaskState;
} | null> = async (title: string, project: number) => {
    try {
        const query = 'INSERT INTO Task(title, state, project_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [title, 'TO_DO', project];
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
    createTask: async (_parent: any, args: { title: string, project: number }, context: any) => {
        try {
            const { title, project } = args
            const task = await createTask(title, project);
            if(task) {
                context.pubsub.publish(TASK_ADDED_EVENT, task);
            }
            return task;
        } catch (error) {
            console.error("Erreur lors de la mutation login :", error);
            return false;
        }
    },
    updateTaskState: async (_parent: any, args: { id: number, state: string }, context: any) => {
        try {
            const { id, state } = args
            const task = await updateTaskState(id, state);
            if(task) {
                context.pubsub.publish(TASK_UPDATE_EVENT, task);
            }
            return task;
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return false;
        }
    },
};

export const TaskSubscription = {
    taskAdded: {
        subscribe: (_parent: any, _args: any, context: any) => {
            return context.pubsub.asyncIterableIterator(TASK_ADDED_EVENT);
        },
        resolve: (payload: Task) => {
            return payload;
        },
    },
    taskUpdated: {
        subscribe: (_parent: any, _args: any, context: any) => {
            return context.pubsub.asyncIterableIterator(TASK_UPDATE_EVENT);
        },
        resolve: (payload: Task) => {
            return payload;
        },
    },
}