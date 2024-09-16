<script>
  import "./app.css";
  import HomePage from "./lib/HomePage.svelte";
  import GamePage from "./lib/GamePage.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import ResultPage from "$lib/ResultPage.svelte";
  import { ModeWatcher } from "mode-watcher";
  import Sun from "svelte-radix/Sun.svelte";
  import Moon from "svelte-radix/Moon.svelte";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button";

  export let url = "";
</script>

<ModeWatcher />

<div class="flex flex-col items-center justify-center min-h-screen p-4">
  <div class="flex gap-4">
    <Button on:click={toggleMode} variant="outline" size="icon">
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
    <h1 class="text-3xl font-bold mb-8">Manasilayo?</h1>
  </div>
  <div
    class="w-full max-w-md p-8 space-y-6 bg-white border rounded-lg shadow-md dark:bg-black"
  >
    <Router {url}>
      <div>
        <Route path="/game" component={GamePage} />
        <Route path="/scoreboard" component={ResultPage} />
        <Route path="/"><HomePage /></Route>
      </div>
    </Router>
  </div>
</div>
