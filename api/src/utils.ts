import bcrypt from 'bcryptjs';
/*
Install good version of bcryptjs for fix problem :
npm install --save-dev bcryptjs@2.4.3
npm i --save-dev @types/bcryptjs
 */

const salt = bcrypt.genSaltSync(10);

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compareSync(password, hashedPassword);
}