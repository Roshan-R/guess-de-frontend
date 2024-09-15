import { writable } from "@macfja/svelte-persistent-store"

type Player = {
    name: string,
    score: number
}

// Initialize players store with an array of player objects
const playerStore = writable("players", new Array<Player>());
const roundStore = writable("rounds", 0);

export { playerStore, roundStore }
