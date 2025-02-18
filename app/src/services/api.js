import {client} from "./apolloClient.js";
import {gql} from "@apollo/client";
import { jwtDecode } from "jwt-decode";

export const getUserInfo = () => {
    const token = localStorage.getItem("token");
    return jwtDecode(token);
}

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
            owner {
                id
            }
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

export const getProjectsWithOffset = async (offset, limit) => {
    try {
        const response = await client.query({
            query: gql`
         query ($offset: Int!, $limit: Int!) {
          projectsFilter(offset: $offset, limit: $limit) {
            id
            name
            description
            lastUpdate
            createdAt
            owner {
              email
              id
            }
          }
        }
      `, variables: {
                offset: offset,
                limit: limit
            }
        });
        return response.data.projectsFilter;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        alert("Une erreur est survenue lors de la connexion.");
        return [];
    }
};


export const getSearchProjects = async (keyword) => {
    try {
        const response = await client.query({
            query: gql`
        query ($keyword: String!) {
            searchProjects(keyword: $keyword) {
                id
                name
                description
                owner {
                    id
                    email
                    role
                }
            }
        }
      `, variables: {
                keyword: keyword
            }
        });
        return response.data.searchProjects;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        alert("Une erreur est survenue lors de la connexion.");
        return [];
    }
};

export const createComment = async (text, projectId) => {
    try {
        const result = await client.mutate({
            mutation: gql`
        mutation CreateComment($text: String!, $project: Int!) {
          createComment(text: $text, project: $project) {
            id
          }
        }
      `,
            variables: {
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
    try {
        const result = await client.mutate({
            mutation: gql`
        mutation CreateProject($name: String!, $description: String!) {
          createProject(name: $name, description: $description) {
            id
          }
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
          updateTaskState(id: $id, state: $state) {
            id
          }
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
          createTask(title: $title, project: $project) {
            id
          }
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

export const getTaskByState = async (id, state) => {
    try {
        const response = await client.query({
            query: gql`
            query ($project: Int!, $status: String!) {
              tasksByStatus(project: $project, status: $status) {
                id
                title
                state
              }
            }
        `,
            variables: { project: id, status: state },
        });
        return response.data.tasksByStatus;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return null;
    }
}

export const getProjectDetails = async (projectId) => {
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
                tasks {
                  id
                  title
                  state
                }
                comments {
                  author {
                    id
                    email
                    role
                  }
                  id
                  text
                }
                owner {
                  id
                  email
                  role
                }
              } 
            }
        `,
            variables: { id: projectId },
        });
        return response.data.project;
    } catch (err) {
        console.error("Erreur dans la requête :", err);
        return null;
    }
}