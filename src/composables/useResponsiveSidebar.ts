import { onMounted, ref } from 'vue'

/** Barre latérale ouverte sur grand écran, repliée sur mobile. */
export function useResponsiveSidebar(breakpoint = 800) {
    const sidebar = ref(true)
    onMounted(() => { sidebar.value = window.innerWidth >= breakpoint })
    return {
        sidebar,
        toggleSidebar: () => { sidebar.value = !sidebar.value },
        closeOnMobile: () => { if (window.innerWidth < breakpoint) sidebar.value = false },
    }
}