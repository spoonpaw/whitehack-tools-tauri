<script lang="ts">
  import '../app.css';
  import { onMount, type Snippet } from 'svelte';
  import { initDatabase, getSetting, setSetting } from '$lib/stores/database';
  import { loadCharacters } from '$lib/stores/characters.svelte';
  import { initTheme, getTheme, toggleTheme } from '$lib/stores/ui.svelte';

  let { children }: { children: Snippet } = $props();

  // App initialization state
  let isInitialized = $state(false);
  let initError = $state<string | null>(null);

  // Get theme state
  const isDark = $derived(getTheme() === 'dark');

  onMount(async () => {
    try {
      // Initialize database
      await initDatabase();

      // Load saved theme
      const savedTheme = await getSetting('theme');
      initTheme(savedTheme ?? 'dark');

      // Load characters
      await loadCharacters();

      isInitialized = true;
      console.log('[App] Initialized successfully');
    } catch (e) {
      initError = e instanceof Error ? e.message : 'Failed to initialize app';
      console.error('[App] Init error:', e);
      // Still show the app even if there's an error
      isInitialized = true;
    }
  });

  async function handleToggleTheme() {
    toggleTheme();
    // Save theme preference
    try {
      await setSetting('theme', getTheme());
    } catch (e) {
      console.error('[App] Failed to save theme:', e);
    }
  }
</script>

<div class="min-h-screen">
  {#if !isInitialized}
    <!-- Loading state -->
    <div class="flex h-screen items-center justify-center">
      <div class="text-center">
        <div class="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mx-auto"></div>
        <p class="text-neutral-400">Loading Whitehack Tools...</p>
      </div>
    </div>
  {:else}
    <!-- Header -->
    <header class="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 class="text-lg font-bold text-neutral-100">
          Whitehack Tools
        </h1>
        <div class="flex items-center gap-3">
          <!-- Theme Toggle -->
          <button
            type="button"
            onclick={handleToggleTheme}
            class="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {#if isDark}
              <!-- Sun icon -->
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            {:else}
              <!-- Moon icon -->
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </header>

    <!-- Error banner -->
    {#if initError}
      <div class="bg-red-900/50 border-b border-red-800 px-4 py-2 text-center text-red-200 text-sm">
        {initError}
      </div>
    {/if}

    <!-- Main content -->
    <main>
      {@render children()}
    </main>
  {/if}
</div>
