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

const hasAccess = async (context: any) => {
    if (!context.user) {
        throw new Error("Accès interdit : Vous devez être authentifié pour accéder à cette requête.");
    }

    return {
        id: context.user.id,
        email: context.user.email,
        role: context.user.role,
    };
};

/*
    FONCTIONNEL MAIS INCOMPREHENSIBLE CODE, TODO COMMENT PASSER UN CONTEXT GRAPHQL A SES RESOLVERS EN PROPRE
 */
const me = (parent: any, args: any, context: any) => {
    return hasAccess(args);
};


export const userResolver = {
    user: ({ id }: { id: string | number }) => getUserEmail(Number(id)),
    users: () => getUsers(),
    me: (parent: any, args: any, context: any) => me(parent, args, context),
};



export const createUser = async (email: string, password: string, role: string) => {
    try {
        const query = 'INSERT INTO UserAccount(email, password, role) VALUES ($1, $2, $3)';
        const hashedPassword = hashPassword(password);
        const values = [email, hashedPassword, role];
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
            return false;
        }
    },
    register: async ({ email, password }: { email: string, password: string }) => {
        try {
            const result = await createUser(email, password, 'USER');
            if(result) {
                const users = await getUsers();
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
};
