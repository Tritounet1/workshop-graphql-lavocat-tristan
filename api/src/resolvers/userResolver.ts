import { client } from "../app";
import {User} from "../types";
import {hashPassword, comparePassword, createTokenFromJson} from "../utils";

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


export const createUser = async (email: string, password: string) => {
    try {
        const query = 'INSERT INTO UserAccount(email, password, role) VALUES ($1, $2, $3)';
        const hashedPassword = hashPassword(password);
        const values = [email, hashedPassword, 'USER'];
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

export const userMutation = {
    login: async ({ email, password }: { email: string; password: string }) => {
        try {
            const users = await getUsers();
            const user = users?.find((user) => user.email === email && comparePassword(password, user.password)) !== undefined
            if(user) {
                const role  = users?.find!((user) => user.email === email)?.role;
                const token = createTokenFromJson({ email: email, role: role });
                if(token) {
                    return token;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        } catch (error) {
            console.error("Erreur lors de la mutation login :", error);
            return false;
        }
    },
    register: async ({ email, password }: { email: string, password: string }) => {
        try {
            const result = await createUser(email, password);
            if(result) {
                const token = createTokenFromJson({ email: email, role: 'USER' });
                if(token) {
                    return token;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        } catch (error) {
            console.error("Erreur lors de la mutation login :", error);
            return null;
        }
    },
};
