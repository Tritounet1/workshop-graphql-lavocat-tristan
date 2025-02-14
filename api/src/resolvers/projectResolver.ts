import { Project } from "../types";

const projects: Project[] = [
    { id: 1, name: 'Project 1', description: 'description...', lastUpdate: 0 },
    { id: 1, name: 'Project 2', description: 'description...', lastUpdate: 0 },
];

export const projectResolver = {
    projects: () => projects,
};
