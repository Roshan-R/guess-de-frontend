<script lang="ts">
  import { get } from "svelte/store";
  import PlusIcon from "./components/icons/PlusIcon.svelte";
  import MinusIcon from "./components/icons/MinusIcon.svelte";
  import ArrowRightIcon from "./components/icons/ArrowRightIcon.svelte";
  import { playerStore } from "./store";
  import { Link } from "svelte-routing";

  const addPlayer = () => {
    playerStore.update((currentPlayers) => [
      ...currentPlayers,
      { name: "", score: 0 },
    ]);
  };

  const updatePlayerName = (index: string, value: number) => {
    console.log(get(playerStore));
    playerStore.update((currentPlayers) => {
      const updatedPlayers = [...currentPlayers];
      updatedPlayers[index].name = value;
      return updatedPlayers;
    });
  };

  //const updatePlayerScore = (index, value) => {
  //    players.update((currentPlayers) => {
  //        const updatedPlayers = [...currentPlayers];
  //        updatedPlayers[index].score = parseInt(value) || 0; // Ensure score is an integer
  //        return updatedPlayers;
  //    });
  //};

  const removePlayer = (index: number) => {
    playerStore.update((currentPlayers) => {
      const updatedPlayers = [...currentPlayers];
      updatedPlayers.splice(index, 1);
      return updatedPlayers;
    });
  };
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold">Who are playing?</h2>
  <div class="space-y-2">
    {#if $playerStore.length === 0}
      <!-- Placeholder player input when no players exist -->
      <div class="flex items-center space-x-2">
        <button
          class="flex justify-center p-2 border rounded w-full"
          on:click={addPlayer}
        >
          <PlusIcon />
        </button>
      </div>
    {/if}
    {#each $playerStore as player, index}
      <div class="flex items-center space-x-2">
        <input
          type="text"
          class="flex-1 p-2 border rounded"
          bind:value={player.name}
          placeholder="Enter player name"
          on:input={(e) => updatePlayerName(index, e.target.value)}
        />
        {#if index === $playerStore.length - 1}
          <button class="p-2 border rounded" on:click={addPlayer}>
            <PlusIcon />
          </button>
        {/if}
        <button class="p-2 border rounded" on:click={() => removePlayer(index)}>
          <MinusIcon />
        </button>
      </div>
    {/each}
  </div>
</div>
<Link to="/game">
  <button class="flex justify-center w-full py-2 mt-4 border rounded">
    <ArrowRightIcon />
  </button>
</Link>
