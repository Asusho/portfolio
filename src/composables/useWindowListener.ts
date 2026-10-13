import { onMounted, onUnmounted } from 'vue'

/** Écoute un événement de la fenêtre, et le retire automatiquement quand le composant disparaît. */
export function useWindowListener<K extends keyof WindowEventMap>(type: K, handler: (e: WindowEventMap[K]) => void) {
    onMounted(() => window.addEventListener(type, handler))
    onUnmounted(() => window.removeEventListener(type, handler))
}