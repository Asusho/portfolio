export type ProjectStatus = 'finished' | 'ongoing' | 'concept';
export type ProjectDomain = 'web' | 'game' | 'xr' | 'software' | 'other';
export interface Project{
    id: string;
    title: string;
    domains: ProjectDomain[];
    description: string;
    tags: string[];
    url?:  string;
    status: ProjectStatus;
    image?: string;
}

export interface Skill {
    name: string;
    category: string;
    detail: string;
}

export interface PortfolioData {
    profile: {
        firstName: string
        lastName: string
        role: string
        bio: string
        githubUsername: string
        contactEmail: string
        photo?: string
    }
    skills: Skill[]
    projects: Project[]
}