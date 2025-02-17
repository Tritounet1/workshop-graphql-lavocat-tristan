import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {resolvers} from './schemas/resolvers';
import {typeDefs} from './schemas/typeDefs';
import { PubSub } from 'graphql-subscriptions';
import {getUserFromRequest, loadDatas} from "./utils";
import {startStandaloneServer} from "@apollo/server/standalone";

const pubsub = new PubSub();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

startStandaloneServer(server, {
  listen: { port: 5050 },
  context: async ({ req }) => ({
    authUser: async () => ({
      user: await getUserFromRequest(req),
    }),
  }),
}).then((serv) => {
  console.log(`🚀 Server ready at: ${serv.url}`);
  loadDatas();
})