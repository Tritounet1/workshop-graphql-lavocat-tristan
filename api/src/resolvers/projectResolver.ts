import {client} from "../client";
import {Project, Task, Comment} from "../types";

const PROJECT_ADDED_EVENT = "projectAdded";
const PROJECT_DELETED_EVENT = "projectDeleted";

export const getUserById = async (id: number) => {
    console.log(id);
    const query = 'SELECT * FROM UserAccount WHERE id = $1';
    const values = [id];
    const result = await client.query(query, values);
    if(result.rows[0]) {
        return {
            id: result.rows[0].id,
            email: result.rows[0].email,
            role: result.rows[0].role,
        }
    }
    return null;
}

export const getAuthorById = async (id: number) => {
    await client.query(`SELECT author_id FROM Comment WHERE project_id = ${id}`).then(async(owner) => {
        return await getUserById(owner.rows[0].author_id);
    });
}

export const getCommentsPerProjectId = async(project_id : number) => {
    return await client.query(`SELECT * FROM Comment WHERE project_id = ${project_id}`).then((commentsArray) => {
        return commentsArray.rows.map( async(comment: Comment) => {
            const user = await getAuthorById(comment.id);
            return {
                id: comment.id,
                author: user,
                text: comment.text,
            }
        })
    });
}

export const getTasksPerProjectId = async(project_id: number) => {
    return await client.query(`SELECT * FROM Task WHERE project_id = ${project_id}`).then((tasksArray) => {
        return tasksArray.rows.map((task: Task) => {
            return {
                id: task.id,
                title: task.title,
                state: task.state,
            }
        })
    });
}

const getProjects = async () => {
    try {
        const result = await client.query('SELECT * FROM Project');
        const formattedResult =  result.rows.map( async(row: Project) => {
            const project_id = row.id;
            return {
                id: project_id,
                name: row.name,
                description: row.description,
                lastUpdate: row.last_update ? new Date(row.last_update).toISOString() : null,
                createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
            }
        });
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const getProject = async (id: number) => {
    try {
        const query = 'SELECT * FROM Project WHERE id = $1';
        const values = [id];
        const result = await client.query(query, values);
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            lastUpdate: row.last_update ? new Date(row.last_update).toISOString() : null,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
            owner: row.owner_id,
        };
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        throw new Error('Impossible de récupérer le projet');
    }
};

export const createProject = async (name: string, description: string) => {
    try {
        /* TODO GET USER TO SET OWNER_ID WITH THE JWT TOKEN */
        const owner_id = 1;
        const query = 'INSERT INTO Project(name, description, owner_id, last_update, created_at) VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_DATE) RETURNING *';
        const values = [name, description, owner_id];
        const result = await client.query(query, values);
        const row = result.rows[0];
        console.log("ROW : ", row);
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            lastUpdate: row.last_update ? new Date(row.last_update).toISOString() : null,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
            comments: [],
            tasks: [],
        };
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

const deleteProject = async (id: number) => {    try {
    const query = 'DELETE FROM Project WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await client.query(query, values);
    const row = result.rows[0];
    return row.id;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

const updateProjectLastDate = async (id: number) => {
    try {
        const query = 'UPDATE Project SET last_update = NOW() WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await client.query(query, values);
        const row = result.rows[0];
        const formattedResult = {
            id: row.id,
            name: row.name,
            description: row.description,
            last_update: row.last_update ? new Date(row.last_update).toISOString() : null,
            created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
            comments: row.comments,
            tasks: row.tasks,
        };
        if(formattedResult) {
            return formattedResult;
        }
        return null;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
};

export const ProjectQueries = {
    project: async (_parent: any, args: { id: number }) => getProject(args.id),
    projects: () => getProjects(),
};


export const ProjectMutation = {
    createProject: async (_parent: any, args: { name: string; description: string }, context: any) => {
        try {
            const { name, description } = args
            const result = await createProject(name, description);
            if(result) {
                context.pubsub.publish(PROJECT_ADDED_EVENT, result);
            }
            return result;
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return false;
        }
    },
    updateProjectDate: async (_parent: any, args: { id: number }) => {
        try {
            const { id } = args
            const result = await updateProjectLastDate(id);
            return result;
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return false;
        }
    },
    deleteProject: async (_parent: any, args: { id: number }, context: any) => {
        try {
            const { id } = args
            const result = await deleteProject(id);
            if(result) {
                context.pubsub.publish(PROJECT_DELETED_EVENT, result);
            }
            return result;
        } catch (error) {
            console.error("Erreur lors de la mutation :", error);
            return false;
        }
    }
}

export const ProjectSubscription = {
    projectAdded: {
        subscribe: (_parent: any, _args: any, context: any) => {
            return context.pubsub.asyncIterableIterator(PROJECT_ADDED_EVENT);
        },
        resolve: (payload: Project) => {
            return payload;
        },
    },
    projectDeleted: {
        subscribe: (_parent: any, _args: any, context: any) => {
            return context.pubsub.asyncIterableIterator(PROJECT_DELETED_EVENT);
        },
        resolve: (payload: string) => {
            return payload;
        },
    },
}