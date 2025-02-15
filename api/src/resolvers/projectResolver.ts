import { client } from "../app";
import { Project } from "../types";

const getProjects = async () => {
    try {
        const result = await client.query('SELECT * FROM Project');
        const formattedResult = result.rows.map((row: Project) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            lastUpdate: row.last_update ? new Date(row.last_update).toISOString() : null,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const getProject = async (id: number) => {
    try {
        const query = 'SELECT * FROM Project WHERE id = $1';
        const values = [id];
        const result = await client.query(query, values);


        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        const formattedResult = {
            id: row.id,
            name: row.name,
            description: row.description,
            lastUpdate: row.last_update ? new Date(row.last_update).toISOString() : null,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
        };

        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        throw new Error('Impossible de récupérer le projet');
    }
};

export const projectResolver = {
    projects: () => getProjects(),
    project: ({ id }: { id: string | number }) => getProject(Number(id)),
};

const createProject = async (name: string, description: string) => {
    try {
        const query = 'INSERT INTO Project(name, description) VALUES ($1, $2)';
        const values = [name, description];
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

export const createProjectMutation = {
    createProject: async ({ name, description }: { name: string; description: string }) => {
        try {
            const result = await createProject(name, description);
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
};
