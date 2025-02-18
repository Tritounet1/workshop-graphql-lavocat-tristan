import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { contextFromConnectionParams, contextFromRequest } from "./context";
import schema from "./schemas/schema";

const app = express();
const server = http.createServer(app);

const wsServer = new WebSocketServer({
  server,
  path: "/",
});

const wsServerCleanup = useServer(
    {
      schema,
      context: ({ connectionParams }) =>
          contextFromConnectionParams(connectionParams ?? {}),
    },
    wsServer
);

const gqlServer = new ApolloServer<any>({
  schema: schema,
  csrfPrevention: true,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer: server }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose();
          },
        };
      },
    },
  ],
});

gqlServer.start().then(() => {
    app.use(
        "/",
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(gqlServer, {
            context: ({ req }) => contextFromRequest(req),
        })
    );

    const host = "0.0.0.0";
    const port = 5050;

    server.listen(
        {
            host,
            port,
        },
        () => {
            console.log(`🚀 Server ready at http://${host}:${port}`);
            console.log(`📅 Subscriptions ready at http://${host}:${port}`);
        }
    );
});