import {client} from "./apolloClient.js";
import {gql} from "@apollo/client";

const getUserId = async () => {
    try {
        const response = await client.query({
            query: gql`
            query {
              me {
                id
              }
            }
      `,
        });
        return response.data.me.id;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return null;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await client.query({
            query: gql`
            query {
              me {
                email
                role
              }
            }
      `,
        });
        return response.data.me;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return null;
    }
}

export const getUserRole = async () => {
    try {
        const response = await client.query({
            query: gql`
            query {
              me {
                role
              }
            }
      `,
        });
        return response.data.me.role;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return null;
    }
}

export const getProjectById = async (id) => {
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
            variables: { id },
        });
        return response.data.project;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return null;
    }
};

export const getCommentsByProjectId = async (id) => {
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
            variables: { id },
        });
        return response.data.comment;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return [];
    }
};

export const getTasksByProjectId = async (id) => {
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
            variables: { id },
        });
        return response.data.task;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return [];
    }
};

export const getUserEmailById = async (id) => {
    try {
        const response = await client.query({
            query: gql`
        query GetUserEmail($id: ID!) {
          user(id: $id)
        }
      `,
            variables: { id },
        });
        return response.data.user;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return null;
    }
};

export const login = async (email, password) => {
    try {
        const result = await client.mutate({
            mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `,
            variables: { email, password },
        });

        if (result.data.login) {
            localStorage.setItem("token", result.data.login);
            return true;
        } else {
            console.error("Identifiants incorrects.");
            return false;
        }
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return false;
    }
};

export const register = async (email, password) => {
    try {
        const result = await client.mutate({
            mutation: gql`
        mutation Register($email: String!, $password: String!) {
          register(email: $email, password: $password)
        }
      `,
            variables: { email, password },
        });

        if (result.data.register) {
            localStorage.setItem("token", result.data.register);
            return true;
        } else {
            console.error("Échec de l'inscription.");
            return false;
        }
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return false;
    }
};

export const getProjects = async () => {
    try {
        const response = await client.query({
            query: gql`
        query GetProjects {
          projects {
            id
            name
            description
            lastUpdate
            createdAt
          }
        }
      `,
        });
        return response.data.projects;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        alert("Une erreur est survenue lors de la connexion.");
        return [];
    }
};

export const createComment = async (text, projectId) => {
    try {
        const authorId = await getUserId();

        const result = await client.mutate({
            mutation: gql`
        mutation CreateComment($author: Int!, $text: String!, $project: Int!) {
          createComment(author: $author, text: $text, project: $project)
        }
      `,
            variables: {
                author: Number(authorId),
                text,
                project: projectId,
            },
        });
        if (result.data.createComment) {
            return { success: true };
        } else {
            return { success: false, error: "Erreur dans la création du commentaire." };
        }
    } catch (err) {
        console.error("Erreur dans la mutation :", err);
        return { success: false, error: "Une erreur est survenue lors de la requête." };
    }
};

export const createProject = async (name, description) => {
    const role = await getUserRole();

    if (!role) {
        return { success: false, error: "Impossible de créer un projet sans être admin." };
    }
    if (role !== "ADMIN") {
        return { success: false, error: "Impossible de créer un projet sans être admin." };
    }

    try {
        const result = await client.mutate({
            mutation: gql`
        mutation CreateProject($name: String!, $description: String!) {
          createProject(name: $name, description: $description)
        }
      `,
            variables: {
                name,
                description,
            },
        });
        if (result.data.createProject) {
            return { success: true };
        } else {
            return { success: false, error: "Erreur lors de la création du projet." };
        }
    } catch (error) {
        console.error("Erreur dans la mutation :", error);
        return { success: false, error: "Une erreur est survenue lors de la requête." };
    }
};

export const deleteProject = async (id) => {
    const role = await getUserRole();

    if (!role) {
        return { success: false, error: "Impossible de supprimer un projet sans être admin." };
    }
    if (role !== "ADMIN") {
        return { success: false, error: "Impossible de supprimer un projet sans être admin." };
    }

    try {

        const result = await client.mutate({
            mutation: gql`
        mutation DeleteProject($id: ID!) {
          deleteProject(id: $id)
        }
      `,
            variables: {
                id,
            },
        });
        console.log(result);
        if (result) {
            return { success: true };
        } else {
            return { success: false, error: "Erreur lors de la suppréssion du projet." };
        }
    } catch (error) {
        console.error("Erreur dans la mutation :", error);
        return { success: false, error: "Une erreur est survenue lors de la requête." };
    }
};

export const updateTaskState = async (taskId, newState, lastState) => {
    if (newState === lastState) {
        return { success: false, error: "L'état n'a pas changé." };
    }
    try {
        const result = await client.mutate({
            mutation: gql`
        mutation UpdateTaskState($id: ID!, $state: String!) {
          updateTaskState(id: $id, state: $state)
        }
      `,
            variables: {
                id: taskId,
                state: newState,
            },
        });
        if (result.data.updateTaskState) {
            return { success: true };
        } else {
            return { success: false, error: "Erreur lors de la mise à jour de l'état de la tâche." };
        }
    } catch (err) {
        console.error("Erreur dans la mutation :", err);
        return { success: false, error: "Une erreur est survenue lors de la requête." };
    }
};

export const createTask = async (title, projectId) => {
    if (!title || !projectId) {
        return { success: false, error: "Veuillez compléter tous les champs requis." };
    }

    try {
        const result = await client.mutate({
            mutation: gql`
        mutation CreateTask($title: String!, $project: Int!) {
          createTask(title: $title, project: $project)
        }
      `,
            variables: {
                title,
                project: projectId,
            },
        });

        if (result.data.createTask) {
            return { success: true };
        } else {
            return { success: false, error: "Erreur lors de la création de la tâche." };
        }
    } catch (error) {
        console.error("Erreur dans la mutation :", error);
        return { success: false, error: "Une erreur est survenue lors de la requête." };
    }
};