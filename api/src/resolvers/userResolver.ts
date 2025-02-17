import { client } from "../client";
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

export const userQueries = {
    users: () => getUsers(),
};

export const createUser = async (email: string, password: string, role: string) => {
    try {
        const query = 'INSERT INTO UserAccount(email, password, role) VALUES ($1, $2, $3) RETURNING *';
        const hashedPassword = hashPassword(password);
        const values = [email, hashedPassword, role];
        const result = await client.query(query, values);
        const formatedResult = {
            id: result.rows[0].id,
            email: result.rows[0].email,
            password: hashedPassword,
            role: result.rows[0].role,
        }
        return formatedResult;
    } catch (err) {
        console.error('Erreur lors de la requête :', err);
        return null;
    }
}

export const userMutation = {
    login: async (_parent: any, args: { email: string; password: string }) => {
        try {
            const { email, password } = args
            const users = await getUsers();
            const user = users?.find((user) => user.email === email && comparePassword(password, user.password)) !== undefined
            if(user) {
                const id  = users?.find!((user) => user.email === email)?.id;
                const role  = users?.find!((user) => user.email === email)?.role;
                const token = createTokenFromJson({ id: id, email: email, role: role });
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
    register: async (_parent: any, args: { email: string; password: string }) => {
        try {
            const { email, password } = args
            const result = await createUser(email, password, 'USER');
            if(result) {
                const id  = result.id;
                const role  = result.role;

                const token = createTokenFromJson({ id: id, email: email, role: role });
                console.log('token : ', token);
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
