import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

const API_ENDPOINT = "http://localhost:5050/api"

export const getProjectById = async (id) => {
    const client = new ApolloClient({
        uri: API_ENDPOINT,
        cache: new InMemoryCache(),
    });

    try {
        const response = await client.query({
            query: gql`
        query GetProject($id: ID!) {
          project(id: $id) {
            id
            name
            description
            lastUpdate
            createdAt
          }
        }
      `,
            variables: {
                "id": id,
            },
        });
        return response.data.project;
    } catch (err) {
        console.error('Erreur dans la requête :', err);
        return null;
    }
};

export const getCommentsByProjectId = async (id) => {
    const client = new ApolloClient({
        uri: API_ENDPOINT,
        cache: new InMemoryCache(),
    });

    try {
        const response = await client.query({
            query: gql`
        query GetComment($id: ID!) {
          comment(id: $id) {
            id
            author
            text
            project
          }
        }
      `,
            variables: {
                "id": id,
            },
        });
        return response.data.comment;
    } catch (err) {
        return [];
    }
};

export const getTasksByProjectId = async (id) => {
    const client = new ApolloClient({
        uri: API_ENDPOINT,
        cache: new InMemoryCache(),
    });

    try {
        const response = await client.query({
            query: gql`
        query GetTask($id: ID!) {
          task(id: $id) {
            id
            title
            state
            project
          }
        }
      `,
            variables: {
                "id": id,
            },
        });
        return response.data.task;
    } catch (err) {
        return [];
    }
};

export const getUserEmailById = async (id) => {
    const client = new ApolloClient({
        uri: API_ENDPOINT,
        cache: new InMemoryCache(),
    });

    try {
        const response = await client.query({
            query: gql`
        query GetUserEmail($id: ID!) {
          user(id: $id)
        }
      `,
            variables: {
                "id": id,
            },
        });
        return response.data.user;
    } catch (err) {
        console.error('Erreur dans la requête :', err);
        return null;
    }
};