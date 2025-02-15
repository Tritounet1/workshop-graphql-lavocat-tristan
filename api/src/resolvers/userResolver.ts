import { client } from "../app";
import {User} from "../types";

const getUsers = async () => {
    try {
        const result = await client.query('SELECT * FROM UserAccount');
        const formattedResult = result.rows.map((row: User) => ({
            id: row.id,
            email: row.email,
            password: row.password,
            role: row.role,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const getUserEmail = async (id: number) => {
    try {
        const query = 'SELECT email FROM UserAccount WHERE id = $1';
        const values = [id];
        const result = await client.query(query, values);
        console.log(result);
        return result.rows[0].email;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        throw new Error('Impossible de récupérer le projet');
    }
};

export const userResolver = {
    user: ({ id }: { id: string | number }) => getUserEmail(Number(id)),
    users: () => getUsers(),
};


const createUser = async (email: string, password: string) => {
    try {
        const query = 'INSERT INTO UserAccount(email, password, role) VALUES ($1, $2, $3)';
        const values = [email, password, 'USER'];
        const result = await client.query(query, values);
        if (result) {
            return true;
        }
        else {
            return false;
        }
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const loginMutation = {
    login: async ({ email, password }: { email: string; password: string }) => {
        try {
            const users = await getUsers();
            return users?.find((user) => user.email === email && user.password === password) !== undefined;
        } catch (error) {
            console.error("Erreur lors de la mutation login :", error);
            return false;
        }
    },
};

export const userMutation = {
    register: async ({ email, password }: { email: string, password: string }) => {
        try {
            const result = await createUser(email, password);
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
