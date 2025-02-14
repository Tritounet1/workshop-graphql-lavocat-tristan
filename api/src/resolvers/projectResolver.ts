import { client } from "../app";
import { Project } from "../types";

const getProjects = async () => {
    try {
        const result = await client.query('SELECT * FROM Project');
        const formattedResult = result.rows.map((row: Project) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            lastUpdate: row.lastUpdate,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const createProject = async (name: string, description: string, lastUpdate: number) => {
    try {
        const result = await client.query(`INSERT INTO UserAccount(name, description, lastUpdate) VALUES (${name}, ${description}, ${lastUpdate})`);
        return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const projectResolver = {
    projects: () => getProjects,
};
