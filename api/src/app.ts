import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {resolvers} from './schemas/resolvers';
import {typeDefs} from './schemas/typeDefs';
import { PubSub } from 'graphql-subscriptions';
import {getUserFromRequest, loadDatas} from "./utils/utils";
import {startStandaloneServer} from "@apollo/server/standalone";
import { authDirectiveTransformer } from "./directives/auth-directive";

const pubsub = new PubSub();

let schema = makeExecutableSchema({ typeDefs, resolvers });

schema = authDirectiveTransformer(schema);

const server = new ApolloServer({
  schema,
});

startStandaloneServer(server, {
  listen: { port: 5050 },
  context: async ({ req }) => ({
    authUser: await getUserFromRequest(req),
  }),
}).then((serv) => {
  console.log(`🚀 Server ready at: ${serv.url}`);
  loadDatas();
})