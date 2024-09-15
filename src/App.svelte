<script>
  import "./app.css";
  import HomePage from "./lib/HomePage.svelte";
  import GamePage from "./lib/GamePage.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import ResultPage from "$lib/ResultPage.svelte";
  export let url = "";
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4">
  <h1 class="text-3xl font-bold mb-8">Manasilayo?</h1>
  <div
    class="w-full max-w-md p-8 space-y-6 bg-white border rounded-lg shadow-md"
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
