<script lang="ts">
  import { playerStore, roundStore } from "./store";
  import { PlayCircle, PauseCircle, Rewind, FastForward } from "lucide-svelte";
  import ComboBox from "./components/ComboBox.svelte";

  import { Progress } from "$lib/components/ui/progress";
  import { Button } from "$lib/components/ui/button";

  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  // Component state
  let progress = 0;
  let isPlaying = false;
  let guessing = true;
  let selectedPlayer: string | null = null;
  let audio: HTMLAudioElement = new Audio();

  let songIsLoading = true;
  let songTitle = "";
  let audioUrl = "";
  let imageUrl = "";
  let songDescription = "";

  let roundNumber = 1;

  $: roundFinalized = $roundStore - roundNumber == 0 ? true : false;

  // Helper to load a new song and reset the state
  const refreshSong = async () => {
    resetState();
    const baseUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(baseUrl + "/getVideo");
    const data = await response.json();
    [audioUrl, songTitle, imageUrl, songDescription] = data;

    initializeAudio(audioUrl);
    songIsLoading = false;
  };

  // Resets the UI and state for a new round
  const resetState = () => {
    audio.src = null;
    songIsLoading = true;
    progress = 0;
    guessing = true;
    selectedPlayer = null;
    audio.src = "";
    audio.removeEventListener("timeupdate", updateProgress);
    audio.removeEventListener("ended", handleAudioEnd);
  };

  // Sets up audio and event listeners
  const initializeAudio = (url: string) => {
    audio.src = url;
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleAudioEnd);
    audio.play();
  };

  // Update progress bar handler
  const updateProgress = () => {
    progress = (audio.currentTime / audio.duration) * 100 || 0;
  };

  // Handle when the song ends
  const handleAudioEnd = () => {
    isPlaying = false;
  };

  // Toggles play/pause functionality
  const togglePlayPause = () => {
    isPlaying ? audio.pause() : audio.play();
    isPlaying = !isPlaying;
  };

  // Rewind the audio by 10 seconds
  const rewind = () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  // Fast forward the audio by 10 seconds
  const fastForward = () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  // Progress to the next round, updating player score
  const playNextRound = () => {
    roundNumber += 1;
    if (roundFinalized) {
      resetState();
      navigate("/scoreboard", { replace: true });
      return;
    }
    if (!selectedPlayer) {
      alert("Select a player");
      return;
    }

    playerStore.update((currentPlayers) =>
      currentPlayers.map((player) =>
        player.name === selectedPlayer
          ? { ...player, score: player.score + 10 }
          : player,
      ),
    );
    refreshSong();
  };

  const skipRound = () => {
    refreshSong();
  };

  // On component mount, load the first song
  onMount(refreshSong);
</script>

<!-- Scoreboard -->
<div
  class="w-48 h-fit border border-gray-200 rounded-lg fixed top-4 right-4 bg-white shadow-lg"
>
  <div class="p-4">
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
</div>

<div class="text-lg mb-4">Round number {roundNumber}/{$roundStore}</div>

{#if !guessing}
  The song was..<br />
{/if}
{#if !songIsLoading}
  <div>
    <!-- Song Box -->
    <div class="border border-gray-300 rounded-lg px-6 py-4 text-lg mb-8">
      {#if guessing}
        Identify the song!
      {:else}
        <div class="flex items-center space-x-2">
          <img
            src={imageUrl}
            alt=""
            width="88"
            height="88"
            class="flex-none rounded-lg bg-slate-100"
            loading="lazy"
          />
          <div class="min-w-0 flex-auto space-y-1 font-semibold">
            <p class="text-xl leading-6">{songTitle}</p>
            <h2 class="truncate text-sm leading-6">{songDescription}</h2>
          </div>
        </div>
      {/if}
    </div>

    {#if guessing}
      <!-- Progress Bar -->
      <Progress class="mb-8" bind:value={progress} />
      <!-- Music Player Controls -->
      <div class="flex justify-center space-x-4">
        <button class="p-2 border rounded" on:click={rewind}>
          <Rewind class="h-4 w-4" />
          <span class="sr-only">Rewind</span>
        </button>

        <button class="p-2 border rounded" on:click={togglePlayPause}>
          {#if isPlaying}
            <PauseCircle class="h-8 w-12" />
          {:else}
            <PlayCircle class="h-8 w-12" />
          {/if}
          <span class="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </button>

        <button class="p-2 border rounded" on:click={fastForward}>
          <FastForward class="h-4 w-4" />
          <span class="sr-only">Fast Forward</span>
        </button>
      </div>
    {/if}
  </div>

  {#if !guessing}
    <div class="mb-4 text-xl">Who got it first?</div>
    <div class="flex justify-evenly flex-col">
      <ComboBox bind:value={selectedPlayer} />
      <div class="flex justify-evenly mt-5">
        <Button on:click={skipRound}>Skip Round</Button>
        <Button on:click={playNextRound}>Next Round</Button>
      </div>
    </div>
  {/if}

  {#if guessing}
    <!-- Guess Button -->
    <div class="flex justify-center mt-4">
      <Button
        size="lg"
        on:click={() => {
          guessing = false;
          audio.src = null;
        }}
      >
        Guess!
      </Button>
    </div>
  {/if}
{:else}
  Loading a song...
{/if}
