import { reactive } from 'vue'

// Partagé par tous les composants : une image introuvable est signalée une seule fois.
const broken = reactive(new Set<string>())

export function useBrokenImages() {
    return {
        isBroken: (src: string) => broken.has(src),
        markBroken: (src: string) => { broken.add(src) },
    }
}