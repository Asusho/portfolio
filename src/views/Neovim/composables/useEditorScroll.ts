import { nextTick, watch, type Ref } from 'vue'

/** Remonte en haut quand on change de fichier, et garde la ligne du curseur visible. */
export function useEditorScroll(el: Ref<HTMLElement | null>, cursor: Ref<number>, bufferKey: Ref<string>) {
    watch(bufferKey, () => el.value?.scrollTo({ top: 0 }))
    watch(cursor, async () => {
        await nextTick()
        el.value?.querySelector('.cur')?.scrollIntoView({ block: 'nearest' })
    })
}