import {
    getCommentsPerProjectId,
    getTasksPerProjectId,
    getUserById,
    ProjectMutation,
    ProjectQueries,
    ProjectSubscription
} from '../resolvers/projectResolver';
import {taskMutation, taskQueries, TaskSubscription} from '../resolvers/taskResolver';
import { userMutation, userQueries } from '../resolvers/userResolver';
import {CommentMutation, commentQueries, CommentSubscription} from '../resolvers/commentResolver';
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
        ...ProjectSubscription,
        ...CommentSubscription,
        ...TaskSubscription,
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
    },
    Comment: {
        author: async (parent: any, args: any, context: any, info: any) => {
            const result = await client.query(`SELECT author_id FROM Comment WHERE id = ${parent.id}`);
            const row = result.rows[0];
            return await getUserById(row.author_id);
        }
    }
}