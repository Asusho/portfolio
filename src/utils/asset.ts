/** Résout un chemin du dossier public (ex. /images/photo.jpg) en tenant compte du dossier de base de Vite. */
export const asset = (path: string) => (path.startsWith('/') ? import.meta.env.BASE_URL + path.slice(1) : path)

/** Chemin à afficher à l'utilisateur pour savoir où déposer le fichier : /images/photo.jpg */
export const publicPath = (src: string) => '/' + src.slice(import.meta.env.BASE_URL.length)