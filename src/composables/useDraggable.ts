import { computed, ref, type Ref } from 'vue'

/**
 * Rend un élément déplaçable. L'élément est centré tant qu'on ne l'a pas bougé ;
 * branche les trois gestionnaires sur la « poignée » (la barre de titre, par exemple).
 */
export function useDraggable(el: Ref<HTMLElement | null>, margin = 60) {
    const pos = ref<{ x: number; y: number } | null>(null)
    let grab: { dx: number; dy: number } | null = null

    const style = computed(() => (pos.value
        ? { left: `${pos.value.x}px`, top: `${pos.value.y}px` }
        : { left: '50%', top: '50%', translate: '-50% -50%' }))

    function onPointerDown(e: PointerEvent) {
        if (!el.value) return
        const r = el.value.getBoundingClientRect()
        pos.value = { x: r.left, y: r.top } // passe du centrage CSS à une position en pixels, sans saut
        grab = { dx: e.clientX - r.left, dy: e.clientY - r.top }
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }

    function onPointerMove(e: PointerEvent) {
        if (!grab || !el.value) return
        const w = el.value.getBoundingClientRect().width
        pos.value = {
            x: Math.min(window.innerWidth - margin, Math.max(margin - w, e.clientX - grab.dx)),
            y: Math.min(window.innerHeight - 40, Math.max(0, e.clientY - grab.dy)),
        }
    }

    function onPointerUp() { grab = null }

    return { style, onPointerDown, onPointerMove, onPointerUp }
}