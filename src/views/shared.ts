import type { PortfolioData, Project } from '@/types/portfolio'

export interface ThemeViewProps {
    portfolio: PortfolioData
    projects: Project[] // le filtre par statut sera ajouté plus tard
}

export function statusLabel(status: Project['status']) {
    if (status === 'finished') return 'Terminé'
    if (status === 'ongoing') return 'En cours'
    return 'À explorer'
}