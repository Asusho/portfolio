import { ref } from 'vue'
import type { Buf } from '../types'

/** Fichiers ouverts (onglets), fichier courant et ligne du curseur. */
export function useBuffers(resolve: (id: string) => Buf | undefined, onOpened?: (buf: Buf) => void) {
    const open = ref<string[]>(['README.md'])
    const current = ref('README.md')
    const cursor = ref(0)

    function openBuffer(id: string) {
        const buf = resolve(id)
        if (!buf) return
        if (!open.value.includes(id)) open.value.push(id)
        current.value = id
        cursor.value = 0
        onOpened?.(buf)
    }

    function closeBuffer(id: string) {
        if (open.value.length < 2) return
        open.value = open.value.filter((b) => b !== id)
        if (current.value === id) openBuffer(open.value[open.value.length - 1] ?? 'README.md')
    }

    function closeOthers() {
        open.value = [current.value];
    }

    function moveCursor(step: number, lineCount: number) {
        cursor.value = Math.max(0, Math.min(lineCount - 1, cursor.value + step))
    }

    return { open, current, cursor, openBuffer, closeBuffer, moveCursor, closeOthers }
}