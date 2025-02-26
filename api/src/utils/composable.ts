import { GraphQLError } from "graphql";

export function isAuthorized(atLeast: any) {

    const rolesScale: Record<string, number> = {
        ADMIN: 10,
        USER: 1,
    };

    return ((next: any) => (root: any, args: any, context: any, info: any) => {
        if (!context.user) {
            throw new GraphQLError("Vous ne pouvez pas faire ça.", {
                extensions: {
                    code: "CLIENT_FORBIDDEN",
                },
            } as any);
        }

        const user = context.user;
        if (rolesScale[user.role] < rolesScale[atLeast]) {
            throw new GraphQLError("Vous ne pouvez pas faire ça.", {
                extensions: {
                    code: "CLIENT_FORBIDDEN",
                },
            } as any);
        }

        return next(root, args, context, info);
    });
}
