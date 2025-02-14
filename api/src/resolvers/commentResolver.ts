import { User, Comment } from "../types";

const Users: User[] = [
    { id: 1, email: 'user1@gmail.com', password: "1234", },
    { id: 1, email: 'user2@gmail.com', password: "1234", },
];

const Comments: Comment[] = [
    { id: 1, user: Users[0], text: "1234", },
    { id: 1, user: Users[1], text: "1234", },
];

export const commentResolver = {
    comments: () => Comments,
};
