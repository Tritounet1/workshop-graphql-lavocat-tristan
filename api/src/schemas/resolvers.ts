import {
    getCommentsPerProjectId,
    getTasksPerProjectId,
    getUserById,
    ProjectMutation,
    ProjectQueries
} from '../resolvers/projectResolver';
import {taskMutation, taskQueries} from '../resolvers/taskResolver';
import { userMutation, userQueries } from '../resolvers/userResolver';
import {CommentMutation, commentQueries} from '../resolvers/commentResolver';
import {client} from "../client";

export const resolvers = {
    Query: {
        ...ProjectQueries,
        ...userQueries,
        ...commentQueries,
        ...taskQueries,
    },
    Mutation: {
        ...ProjectMutation,
        ...userMutation,
        ...CommentMutation,
        ...taskMutation,
    },
    Subscription: {
    },
    Project: {
        owner: async (parent: any, args: any, context: any, info: any) => {
            const result = await client.query(`SELECT owner_id FROM Project WHERE id = ${parent.id}`);
            const row = result.rows[0];
            return await getUserById(row.owner_id);
        },
        comments: async (parent: any, args: any, context: any, info: any) => {
            return await getCommentsPerProjectId(parent.id);
        },
        tasks: async (parent: any, args: any, context: any, info: any) => {
            return await getTasksPerProjectId(parent.id);
        },
    }
}