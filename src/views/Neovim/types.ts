import type { PortfolioImage } from '@/types/portfolio.ts'

/** Un « fichier » ouvrable dans l'éditeur. */
export interface Buf { id: string; name: string; path: string; ft: string; icon?: string }
export interface StaticBuf extends Buf { icon: string }

export type Img = PortfolioImage

/** Un tableau : titres, lignes, et alignement de chaque colonne. Chaque cellule est une liste de morceaux colorés. */
export interface Table { head: Tok[][]; rows: Tok[][][]; align: ('left' | 'center' | 'right' | null)[] }

/** Un morceau de texte coloré. Il peut aussi être un lien externe (href), interne (go) ou une image (img). */
export interface Tok { t: string; c?: string; go?: string; href?: string; img?: Img; table?: Table }

/** Une ligne de l'éditeur. */
export type Line = Tok[]
