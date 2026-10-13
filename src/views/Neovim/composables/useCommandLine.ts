import { ref } from 'vue'

/** Ce que les commandes savent faire : le composable ne connaît ni les onglets ni le reste de l'application. */
export interface CommandActions {
    edit(arg: string): boolean // true si le fichier existe
    openHelp(): void
    listBuffers(): string
    closeCurrent(): void
    currentPath(): string
    closeOthers(): void
}

/** La ligne de commande façon Vim : saisie après « : », messages d'erreur, commandes. */
export function useCommandLine(a: CommandActions) {
    const cmdOpen = ref(false)
    const cmdText = ref('')
    const message = ref('Appuie sur : pour saisir une commande (essaie :help)')
    const messageErr = ref(false)

    function say(text: string, err = false) { message.value = text; messageErr.value = err }
    function openCmd() { cmdText.value = ''; cmdOpen.value = true }
    function closeCmd() { cmdOpen.value = false }

    function submitCmd() {
        const raw = cmdText.value.trim()
        closeCmd()
        const [name = '', ...rest] = raw.split(/\s+/)
        const arg = rest.join(' ')
        switch (name) {
            case '': return
            case 'e': case 'edit': case 'b': case 'buffer':
                if (!a.edit(arg)) say(`E484: Can't open file ${arg || '(vide)'}`, true)
                return
            case 'help': case 'h': return a.openHelp()
            case 'ls': return say(a.listBuffers())
            case 'bd': case 'bdelete': return a.closeCurrent()
            case 'w': case 'wq': return say(`"${a.currentPath()}" écrit... enfin, presque.`)
            case 'q': case 'quit': return say('E37: No write since last change (add ! to override)', true)
            case 'q!': return say("Impossible de quitter un portfolio : il faut le visiter jusqu'au bout :)")
            case 'only': return a.closeOthers()
            default: return say(`E492: Not an editor command: ${raw}`, true)
        }
    }

    return { cmdOpen, cmdText, message, messageErr, say, openCmd, closeCmd, submitCmd }
}