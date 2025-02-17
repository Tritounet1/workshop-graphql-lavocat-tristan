import { GraphQLDateTime } from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {typeDefs} from "./typeDefs";
import {resolvers} from "./resolvers";
import {authDirectiveTransformer} from "../directives/auth-directive";

const scalarResolvers = {
    DateTime: GraphQLDateTime,
};

let schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: [resolvers, scalarResolvers],
});

schema = authDirectiveTransformer(schema);

export default schema;