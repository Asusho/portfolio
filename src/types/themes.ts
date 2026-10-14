export type ThemeId = 'neovim' | 'outer-wilds' | 'skyrim';
import outerWildsIcon from '@/assets/icons/sun.svg'
import skyrimIcon from '@/assets/icons/skyrim.svg'
import outerWildsFavicon from '@/assets/icons/sun.svg?raw'
import skyrimFavicon from '@/assets/icons/skyrim.svg?raw'
export interface ThemeInfo {
    id: ThemeId
    name: string
    glyph: string // texte de secours
    icon?: string // image SVG, prioritaire sur le glyphe
    faviconSvg?: string
}

export const DEFAULT_THEME: ThemeId = 'neovim'

export const themes: ThemeInfo[] = [
    { id: 'neovim', name: 'Neovim', glyph: '>_' },
    { id: 'outer-wilds', name: 'Outer Wilds', glyph: '◉', icon: outerWildsIcon, faviconSvg: outerWildsFavicon },
    { id: 'skyrim', name: 'Skyrim', glyph: '❄', icon: skyrimIcon, faviconSvg: skyrimFavicon },
]
