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
        console.log(err);
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
        console.log(err);
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

export const login = async (email, password) => {
    const client = new ApolloClient({
        uri: API_ENDPOINT,
        cache: new InMemoryCache(),
    });

    try {
        const result = await client.mutate({
            mutation: gql`
              mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password)
              }
            `,
            variables: {
                email: email,
                password: password,
            },
        });

        if (result.data.login) {
            localStorage.setItem("token", result.data.login);
            return true;
        } else {
            alert('Identifiants incorrects.');
            return false;
        }

    } catch (err) {
        console.error("Erreur dans la requête :", err);
        alert('Une erreur est survenue lors de la connexion.');
        return false;
    }
};

export const register = async (email, password) => {
    const client = new ApolloClient({
        uri: "http://localhost:5050/api",
        cache: new InMemoryCache(),
    });

    try {
        const result = await client.mutate({
            mutation: gql`
              mutation Register($email: String!, $password: String!) {
                register(email: $email, password: $password)
              }
            `,
            variables: {
                email: email,
                password: password,
            },
        });

        if (result.data.register) {
            localStorage.setItem("token", result.data.register);
            return true;
        } else {
            alert('Failed to register.');
            return false;
        }

    } catch (err) {
        console.error("Erreur dans la requête :", err);
        alert('Une erreur est survenue lors de l\'inscription.');
        return false;
    }
};
