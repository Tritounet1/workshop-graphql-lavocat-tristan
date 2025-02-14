import { User } from "../types";

const Users: User[] = [
    { id: 1, email: 'user1@gmail.com', password: "1234", },
    { id: 1, email: 'user2@gmail.com', password: "1234", },
];

export const userResolver = {
    users: () => Users,
};
