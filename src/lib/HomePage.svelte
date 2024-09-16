<script lang="ts">
  import { get } from "svelte/store";
  import PlusIcon from "./components/icons/PlusIcon.svelte";
  import MinusIcon from "./components/icons/MinusIcon.svelte";
  import ArrowRightIcon from "./components/icons/ArrowRightIcon.svelte";
  import { playerStore, roundStore } from "./store";
  import { Link } from "svelte-routing";

  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import * as Dialog from "$lib/components/ui/dialog";

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
  <p class="text-lg font-semibold">Number of rounds</p>
  <ToggleGroup.Root
    type="single"
    class="justify-start"
    bind:value={$roundStore}
  >
    {#each ["3", "5", "10"] as number}
      <ToggleGroup.Item value={number} aria-label="Toggle bold">
        <div class="h-4 w-4">{number}</div>
      </ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
</div>

<Link to="/game">
  <button class="flex justify-center w-full py-2 mt-4 border rounded">
    <ArrowRightIcon />
  </button>
</Link>

<Dialog.Root open={true}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>How to Play</Dialog.Title>
      <div class="space-y-2">
        <h3 class="text-lg font-medium">Set Up the Game:</h3>
        <ul class="ml-4 text-sm list-disc space-y-1">
          <li>Enter the number of players and each player's name.</li>
          <li>Choose the number of rounds you want to play.</li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-medium">Gameplay:</h3>
        <ul class="ml-4 text-sm list-disc space-y-1">
          <li>A song will play in each round.</li>
          <li>
            As soon as you recognize the song, be the first to guess the correct
            title.
          </li>
          <li>The first person to guess the song correctly wins the round.</li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-medium">Winning:</h3>
        <ul class="ml-4 text-sm list-disc space-y-1">
          <li>
            The game continues until the chosen number of rounds is complete.
          </li>
          <li>
            The player with the most correct guesses at the end of all rounds is
            the winner.
          </li>
        </ul>
      </div>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
