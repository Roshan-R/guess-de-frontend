<script lang="ts">
  import { playerStore } from "./store";
  import Button from "./components/ui/button/button.svelte";
  import { Link } from "svelte-routing";

  let winningPlayer = $playerStore.reduce((prev, current) =>
    prev && prev.score > current.score ? prev : current,
  ).name;
</script>

<div class="text-2xl mb-5">Congratulations to {winningPlayer}!</div>

<div class="p-4 mb-6">
  <h2 class="text-lg font-semibold mb-4">Scoreboard</h2>
  <div class="space-y-2">
    {#each $playerStore as player}
      <div class="flex justify-between">
        <span>{player.name}</span>
        <span class="font-bold">{player.score}</span>
      </div>
    {/each}
  </div>
</div>

<Link
  on:click={() => {
    $playerStore.map((player, _) => {
      player.score = 0;
    });
  }}
  to="/"
>
  <Button>Play Again</Button>
</Link>
