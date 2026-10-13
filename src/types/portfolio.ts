export type ProjectStatus = 'finished' | 'ongoing' | 'concept';
export type ProjectDomain = 'web' | 'game' | 'xr' | 'software' | 'other';

export interface PortfolioImage {
    src: string
    alt: string
    caption: string
    kind?: 'image' | 'video' | 'youtube' // 'image' par défaut
    poster?: string // vignette affichée avant la lecture d'une vidéo
}
export interface Project{
    id: string;
    title: string;
    domains: ProjectDomain[];
    description: string;
    stack?: string[];
    tags: string[];
    url?:  string;
    repo?: string;
    status: ProjectStatus;
    image?: string;
    video?: string;
    relatedProjects? : string[]
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