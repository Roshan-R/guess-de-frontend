import { writable } from "@macfja/svelte-persistent-store"

type Player = {
    name: string,
    score: number
}

// Initialize players store with an array of player objects
export const playerStore = writable("players", new Array<Player>());
