import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import {createProject, getProject, getUserById} from "../resolvers/projectResolver";
import {createUser} from "../resolvers/userResolver";
import {createTask} from "../resolvers/taskResolver";
import {createComment} from "../resolvers/commentResolver";
/*
Install good version of bcryptjs for fix problem :
npm install --save-dev bcryptjs@2.4.3
npm i --save-dev @types/bcryptjs
 */

const SECRET = '*Q#KJkE*5ft2#s#WUM@rbQmvFjwRbt7s8mQDYU#z*pti4Vx7L!sj%ht**zmUaMVo';
const salt = bcrypt.genSaltSync(10);

export interface TokenData {
    id: number;
    email: string;
    role: string;
    iat: number;
}

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compareSync(password, hashedPassword);
}

export const createTokenFromJson = (jsonData: any, options={}) => {
    try {
        return jwt.sign(jsonData, SECRET, options);
    }catch (err) {
        console.error('Erreur lors de token:', err);
        return null;
    }
}

export const getTokenData = (token: string): TokenData | null => {
    try {
        if(token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }
        const decoded = jwt.verify(token, SECRET);
        if (typeof decoded === "string") {
            return null;
        }
        return decoded as TokenData;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

export const loadDatas = async() => {
    /* (FOR FIX THE DUPLICATION WHEN HOT RELOAD) */
    const admin = await getUserById(1);
    if(admin) {
        return;
    }
    /* CREATING ADMIN USER */
    createUser("admin@gmail.com", "admin", "ADMIN").then(r => {
        if (r) {
            console.log("Admin create, email: admin@gmail.com, password: admin");
        } else {
            console.log("Can't create admin.")
        }
    });
    /* CREATING DEFAULT USER */
    createUser("user@gmail.com", "user", "USER").then(r => {
        if (r) {
            console.log("User create, email: test@gmail.com, password: 1234");
        } else {
            console.log("Can't create user.")
        }
    });
    const project = await createProject('Task Management', 'Create App for manage tasks');
    if (project) {
        console.log("Example project create.");
    } else {
        console.log("Can't create example project.")
    }
    /* CREATING TASK EXAMPLE */
    await createTask('Verif the readme', 1).then(r => {
        if (r) {
            console.log("Example task create.");
        } else {
            console.log("Can't create example task.")
        }
    });
    /* CREATING COMMENT EXAMPLE */
    await createComment('Hello :)', 1).then(r => {
        if (r) {
            console.log("Example comment create.");
        } else {
            console.log("Can't create example comment.")
        }
    })
}

export async function getUserFromRequest(request: any) {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return undefined;
    }
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const user = getTokenData(token);
        if (user) {
            return user;
        } else {
            console.warn("Invalid token received.");
        }
    }
    return null;
}