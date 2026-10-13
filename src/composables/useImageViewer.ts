import { ref } from 'vue'
import type { PortfolioImage } from '../types/portfolio'

/** État de la fenêtre d'aperçu d'image. */
export function useImageViewer() {
    const image = ref<PortfolioImage | null>(null)
    return {
        image,
        openImage: (img: PortfolioImage) => { image.value = img },
        closeImage: () => { image.value = null },
    }
}