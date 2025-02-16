import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
/*
Install good version of bcryptjs for fix problem :
npm install --save-dev bcryptjs@2.4.3
npm i --save-dev @types/bcryptjs
 */

const SECRET = 'test';
const salt = bcrypt.genSaltSync(10);

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

export const getTokenData = (token: string) => {
    return jwt.verify(token, SECRET);
}