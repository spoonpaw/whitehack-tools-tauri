<script lang="ts">
  import { invoke } from '@tauri-apps/api/core';
  import { onMount } from 'svelte';

  let systemInfo: any = $state(null);
  let isLoading = $state(false);
  let error = $state('');

  async function fetchSystemInfo() {
    try {
      isLoading = true;
      error = '';
      systemInfo = await invoke('get_system_info');
    } catch (err) {
      error = `Error: ${err}`;
      console.error('Error invoking get_system_info:', err);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchSystemInfo();
  });
</script>

<svelte:head>
  <title>Tauri + SvelteKit Boilerplate</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
  <!-- Hero -->
  <div class="text-center mb-12">
    <h1 class="text-5xl font-bold text-neutral-100 mb-4">
      Tauri + SvelteKit + Tailwind
    </h1>
    <p class="text-xl text-neutral-400">
      Production-ready boilerplate with Rust ↔ Frontend communication
    </p>
  </div>

  <!-- Feature Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
    <!-- System Info Card -->
    <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
      <h2 class="text-xl font-semibold text-neutral-100 mb-4 flex items-center gap-2">
        <span class="text-cyan-400">🖥️</span> System Information
      </h2>
      
      <button
        onclick={fetchSystemInfo}
        disabled={isLoading}
        class="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 mb-4"
      >
        {isLoading ? 'Loading...' : 'Refresh System Info'}
      </button>

      {#if error}
        <div class="p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      {/if}

      {#if systemInfo}
        <div class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-neutral-700/50 rounded-lg">
            <span class="text-neutral-400">OS</span>
            <span class="text-neutral-100 font-medium">{systemInfo.os}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-neutral-700/50 rounded-lg">
            <span class="text-neutral-400">Architecture</span>
            <span class="text-neutral-100 font-medium">{systemInfo.arch}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-neutral-700/50 rounded-lg">
            <span class="text-neutral-400">Version</span>
            <span class="text-neutral-100 font-medium">{systemInfo.version}</span>
          </div>
        </div>
      {/if}
    </div>

    <!-- Features Card -->
    <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
      <h2 class="text-xl font-semibold text-neutral-100 mb-4 flex items-center gap-2">
        <span class="text-fuchsia-400">✨</span> Features Included
      </h2>
      
      <ul class="space-y-3">
        <li class="flex items-center gap-3 text-neutral-300">
          <span class="text-cyan-400">✓</span>
          <span>View transitions (smooth navigation)</span>
        </li>
        <li class="flex items-center gap-3 text-neutral-300">
          <span class="text-cyan-400">✓</span>
          <span>Dark/Light mode with persistence</span>
        </li>
        <li class="flex items-center gap-3 text-neutral-300">
          <span class="text-cyan-400">✓</span>
          <span>SQLite database plugin</span>
        </li>
        <li class="flex items-center gap-3 text-neutral-300">
          <span class="text-cyan-400">✓</span>
          <span>Filesystem plugin</span>
        </li>
        <li class="flex items-center gap-3 text-neutral-300">
          <span class="text-cyan-400">✓</span>
          <span>Rust ↔ Frontend IPC</span>
        </li>
        <li class="flex items-center gap-3 text-neutral-300">
          <span class="text-cyan-400">✓</span>
          <span>Tailwind CSS configured</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- CTA -->
  <div class="text-center">
    <a 
      href="/test" 
      class="inline-flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold rounded-xl transition-colors duration-200"
    >
      <span>🔧</span>
      <span>Open Test Suite</span>
    </a>
    <p class="mt-4 text-sm text-neutral-500">
      Run comprehensive tests for all Tauri plugins and features
    </p>
  </div>
</div>
