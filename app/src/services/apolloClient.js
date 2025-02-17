import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions/index.js";

const API_ENDPOINT = "http://localhost:5050/graphql";

const httpLink = createHttpLink({
    uri: API_ENDPOINT,
});

const wsLink = new GraphQLWsLink(createClient({
    url: 'wss://<YOUR-HASURA-INSTANCE-URL>/v1/graphql',
}));

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
