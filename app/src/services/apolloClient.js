import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Définition des endpoints HTTP et WebSocket
const API_HTTP_ENDPOINT = "http://localhost:5050";
const API_WS_ENDPOINT = "ws://localhost:5050";

// HTTP Link pour les requêtes classiques (Query et Mutation)
const httpLink = createHttpLink({
    uri: API_HTTP_ENDPOINT,
});

// Authentification des requêtes HTTP
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// WebSocket Link pour les subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: API_WS_ENDPOINT,
        connectionParams: () => ({
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        }),
    })
);

// Split Link pour router les requêtes en fonction de leur type
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    authLink.concat(httpLink) // Fallback sur HTTP
);

// Création du client Apollo
export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});
