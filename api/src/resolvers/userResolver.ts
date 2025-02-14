import { client } from "../app";
import { User } from "../types";

const getUsers = async () => {
    try {
        const result = await client.query('SELECT * FROM UserAccount');
        const formattedResult = result.rows.map((row: User) => ({
            id: row.id,
            email: row.email,
            password: row.password,
        }));
        return formattedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

const createUser = async (email: string, password: string) => {
    try {
        const result = await client.query(`INSERT INTO UserAccount(email, password) VALUES (${email}, ${password})`);
        return result;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
    }
}

export const userResolver = {
    users: () => getUsers(),
};

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
