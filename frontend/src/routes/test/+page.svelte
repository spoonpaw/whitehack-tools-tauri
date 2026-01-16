<script lang="ts">
  import { invoke } from '@tauri-apps/api/core';
  import { onMount } from 'svelte';
  import Database from "@tauri-apps/plugin-sql";
  import { 
    exists, 
    writeTextFile, 
    readTextFile, 
    remove,
    BaseDirectory 
  } from "@tauri-apps/plugin-fs";

  // Tests results
  let testResults = $state<{ [key: string]: { status: 'pending' | 'success' | 'error' | 'running', result?: string, duration?: number } }>({});
  
  // Form states
  let greetName = $state('Test User');
  let mathA = $state(15);
  let mathB = $state(25);
  let jsonInput = $state('{"name": "test", "value": 42}');

  // Database instance
  let db: Database | null = null;

  async function getDb() {
    if (!db) {
      db = await Database.load("sqlite:demo.db");
    }
    return db;
  }

  // Test functions
  async function runTest(testName: string, testFn: () => Promise<any>) {
    testResults[testName] = { status: 'running' };
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      testResults[testName] = { 
        status: 'success', 
        result: typeof result === 'string' ? result : JSON.stringify(result),
        duration 
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      testResults[testName] = { 
        status: 'error', 
        result: error instanceof Error ? error.message : String(error),
        duration 
      };
    }
  }

  // Basic Tests
  async function testBasicOperation() {
    await runTest('basic', () => invoke('test_basic_operation'));
  }

  async function testMathOperation() {
    await runTest('math', () => invoke('test_math_operation', { a: mathA, b: mathB }));
  }

  async function testAsyncDelay() {
    await runTest('async', () => invoke('test_async_delay'));
  }

  async function testErrorHandling() {
    await runTest('error', async () => {
      try {
        await invoke('test_error_handling');
        throw new Error('Expected an error, but the command succeeded.');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes('Erreur de test volontaire')) return message;
        throw new Error(`Unexpected error: ${message}`);
      }
    });
  }

  async function testGreet() {
    await runTest('greet', () => invoke('greet', { name: greetName }));
  }

  async function testSystemInfo() {
    await runTest('systemInfo', () => invoke('get_system_info'));
  }

  async function testFileOperations() {
    await runTest('fileOps', () => invoke('test_file_operations'));
  }

  async function testJsonParsing() {
    await runTest('jsonParsing', () => invoke('test_json_parsing', { jsonStr: jsonInput }));
  }

  async function testNetworkSimulation() {
    await runTest('networkSim', () => invoke('test_network_simulation'));
  }

  async function testMemoryUsage() {
    await runTest('memoryUsage', () => invoke('test_memory_usage'));
  }

  // SQLite Tests
  async function testSqliteCreate() {
    await runTest('sqliteCreate', async () => {
      const database = await getDb();
      await database.execute(`
        CREATE TABLE IF NOT EXISTS demo_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
      return "✅ Table 'demo_items' created/verified";
    });
  }

  async function testSqliteInsert() {
    await runTest('sqliteInsert', async () => {
      const database = await getDb();
      const now = new Date().toISOString();
      const name = `Item_${Date.now()}`;
      await database.execute(
        "INSERT INTO demo_items (name, created_at) VALUES ($1, $2)",
        [name, now]
      );
      return `✅ Inserted: ${name}`;
    });
  }

  async function testSqliteQuery() {
    await runTest('sqliteQuery', async () => {
      const database = await getDb();
      const rows = await database.select<Array<{id: number, name: string, created_at: string}>>(
        "SELECT * FROM demo_items ORDER BY id DESC LIMIT 5"
      );
      return `✅ Found ${rows.length} rows: ${rows.map(r => r.name).join(', ') || '(none)'}`;
    });
  }

  async function testSqliteDelete() {
    await runTest('sqliteDelete', async () => {
      const database = await getDb();
      const result = await database.execute("DELETE FROM demo_items");
      return `✅ Deleted all rows (affected: ${result.rowsAffected})`;
    });
  }

  async function testSqliteCrud() {
    await runTest('sqliteCrud', async () => {
      const database = await getDb();
      
      // Create
      await database.execute(`
        CREATE TABLE IF NOT EXISTS demo_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
      
      // Insert
      const now = new Date().toISOString();
      await database.execute(
        "INSERT INTO demo_items (name, created_at) VALUES ($1, $2)",
        [`CrudTest_${Date.now()}`, now]
      );
      
      // Query
      const rows = await database.select<Array<{id: number}>>(
        "SELECT * FROM demo_items ORDER BY id DESC LIMIT 1"
      );
      
      // Delete
      await database.execute("DELETE FROM demo_items WHERE id = $1", [rows[0].id]);
      
      return "✅ Full CRUD cycle completed";
    });
  }

  // Filesystem Tests
  const TEST_FILE = "tauri-sveltekit-test.txt";

  async function testFsWrite() {
    await runTest('fsWrite', async () => {
      const content = `Test content generated at ${new Date().toISOString()}`;
      await writeTextFile(TEST_FILE, content, {
        baseDir: BaseDirectory.AppData
      });
      return `✅ Written to AppData/${TEST_FILE}`;
    });
  }

  async function testFsRead() {
    await runTest('fsRead', async () => {
      const content = await readTextFile(TEST_FILE, {
        baseDir: BaseDirectory.AppData
      });
      return `✅ Read: "${content.substring(0, 60)}${content.length > 60 ? '...' : ''}"`;
    });
  }

  async function testFsExists() {
    await runTest('fsExists', async () => {
      const fileExists = await exists(TEST_FILE, {
        baseDir: BaseDirectory.AppData
      });
      return fileExists ? `✅ File exists: ${TEST_FILE}` : `⚠️ File not found: ${TEST_FILE}`;
    });
  }

  async function testFsDelete() {
    await runTest('fsDelete', async () => {
      await remove(TEST_FILE, { baseDir: BaseDirectory.AppData });
      return `✅ Deleted: ${TEST_FILE}`;
    });
  }

  async function testFsCrud() {
    await runTest('fsCrud', async () => {
      const testFile = `crud-test-${Date.now()}.txt`;
      const content = "CRUD test content";
      
      // Write
      await writeTextFile(testFile, content, { baseDir: BaseDirectory.AppData });
      
      // Exists
      const doesExist = await exists(testFile, { baseDir: BaseDirectory.AppData });
      if (!doesExist) throw new Error("File should exist after write");
      
      // Read
      const readContent = await readTextFile(testFile, { baseDir: BaseDirectory.AppData });
      if (readContent !== content) throw new Error("Content mismatch");
      
      // Delete
      await remove(testFile, { baseDir: BaseDirectory.AppData });
      
      // Verify deleted
      const stillExists = await exists(testFile, { baseDir: BaseDirectory.AppData });
      if (stillExists) throw new Error("File should be deleted");
      
      return "✅ Full FS CRUD cycle completed";
    });
  }

  async function runAllTests() {
    testResults = {};
    // Basic tests
    await testBasicOperation();
    await testMathOperation();
    await testGreet();
    await testSystemInfo();
    await testFileOperations();
    await testJsonParsing();
    await testNetworkSimulation();
    await testMemoryUsage();
    await testAsyncDelay();
    await testErrorHandling();
    // SQLite tests
    await testSqliteCreate();
    await testSqliteInsert();
    await testSqliteQuery();
    await testSqliteDelete();
    await testSqliteCrud();
    // FS tests
    await testFsWrite();
    await testFsRead();
    await testFsExists();
    await testFsDelete();
    await testFsCrud();
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'running': return 'text-blue-500';
      default: return 'text-neutral-400';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '⏳';
      default: return '⚪';
    }
  }

  // Initialize tests on mount
  onMount(() => {
    testResults = {
      basic: { status: 'pending' },
      math: { status: 'pending' },
      greet: { status: 'pending' },
      systemInfo: { status: 'pending' },
      fileOps: { status: 'pending' },
      jsonParsing: { status: 'pending' },
      networkSim: { status: 'pending' },
      memoryUsage: { status: 'pending' },
      async: { status: 'pending' },
      error: { status: 'pending' },
      sqliteCreate: { status: 'pending' },
      sqliteInsert: { status: 'pending' },
      sqliteQuery: { status: 'pending' },
      sqliteDelete: { status: 'pending' },
      sqliteCrud: { status: 'pending' },
      fsWrite: { status: 'pending' },
      fsRead: { status: 'pending' },
      fsExists: { status: 'pending' },
      fsDelete: { status: 'pending' },
      fsCrud: { status: 'pending' }
    };
  });
</script>

<svelte:head>
  <title>Test Suite - Tauri + SvelteKit</title>
</svelte:head>

<div class="px-4 py-8 sm:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center text-neutral-100">🔧 Complete Test Suite</h1>
    
    <!-- Quick actions -->
    <div class="mb-8 text-center">
      <button
        onclick={runAllTests}
        class="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mr-4"
      >
        🚀 Run All Tests
      </button>
      <button
        onclick={() => testResults = {}}
        class="bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
      >
        🗑️ Clear Results
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      
      <!-- Basic tests -->
      <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
        <h2 class="text-xl font-semibold mb-4 text-neutral-100">🧪 Basic Tests</h2>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Basic Operation</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.basic?.status || 'pending')}>
                {getStatusIcon(testResults.basic?.status || 'pending')}
              </span>
              <button
                onclick={testBasicOperation}
                class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <div class="flex items-center space-x-2">
              <span class="font-medium text-neutral-200">Math:</span>
              <input bind:value={mathA} type="number" class="w-14 px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-neutral-100 text-sm" />
              <span class="text-neutral-400">+</span>
              <input bind:value={mathB} type="number" class="w-14 px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-neutral-100 text-sm" />
            </div>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.math?.status || 'pending')}>
                {getStatusIcon(testResults.math?.status || 'pending')}
              </span>
              <button
                onclick={testMathOperation}
                class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <div class="flex items-center space-x-2">
              <span class="font-medium text-neutral-200">Greet:</span>
              <input bind:value={greetName} class="w-24 px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-neutral-100 text-sm" />
            </div>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.greet?.status || 'pending')}>
                {getStatusIcon(testResults.greet?.status || 'pending')}
              </span>
              <button
                onclick={testGreet}
                class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- System Tests -->
      <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
        <h2 class="text-xl font-semibold mb-4 text-neutral-100">🖥️ System Tests</h2>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">System Information</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.systemInfo?.status || 'pending')}>
                {getStatusIcon(testResults.systemInfo?.status || 'pending')}
              </span>
              <button
                onclick={testSystemInfo}
                class="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- I/O & Performance Tests -->
      <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
        <h2 class="text-xl font-semibold mb-4 text-neutral-100">💾 I/O & Performance</h2>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">File Ops (Rust)</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.fileOps?.status || 'pending')}>
                {getStatusIcon(testResults.fileOps?.status || 'pending')}
              </span>
              <button
                onclick={testFileOperations}
                class="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="p-3 bg-neutral-700/30 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-neutral-200">JSON Parsing</span>
              <div class="flex items-center space-x-2">
                <span class={getStatusColor(testResults.jsonParsing?.status || 'pending')}>
                  {getStatusIcon(testResults.jsonParsing?.status || 'pending')}
                </span>
                <button
                  onclick={testJsonParsing}
                  class="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
                >
                  Test
                </button>
              </div>
            </div>
            <textarea
              bind:value={jsonInput}
              class="w-full p-2 text-xs border border-neutral-600 bg-neutral-800 text-neutral-100 rounded resize-none"
              rows="2"
              placeholder="JSON to test"
            ></textarea>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Network Sim</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.networkSim?.status || 'pending')}>
                {getStatusIcon(testResults.networkSim?.status || 'pending')}
              </span>
              <button
                onclick={testNetworkSimulation}
                class="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Memory (1MB)</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.memoryUsage?.status || 'pending')}>
                {getStatusIcon(testResults.memoryUsage?.status || 'pending')}
              </span>
              <button
                onclick={testMemoryUsage}
                class="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SQLite Tests -->
      <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
        <h2 class="text-xl font-semibold mb-4 text-neutral-100">🗄️ SQLite Database</h2>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Create Table</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.sqliteCreate?.status || 'pending')}>
                {getStatusIcon(testResults.sqliteCreate?.status || 'pending')}
              </span>
              <button
                onclick={testSqliteCreate}
                class="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Insert Row</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.sqliteInsert?.status || 'pending')}>
                {getStatusIcon(testResults.sqliteInsert?.status || 'pending')}
              </span>
              <button
                onclick={testSqliteInsert}
                class="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Query Data</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.sqliteQuery?.status || 'pending')}>
                {getStatusIcon(testResults.sqliteQuery?.status || 'pending')}
              </span>
              <button
                onclick={testSqliteQuery}
                class="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Delete All</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.sqliteDelete?.status || 'pending')}>
                {getStatusIcon(testResults.sqliteDelete?.status || 'pending')}
              </span>
              <button
                onclick={testSqliteDelete}
                class="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-cyan-900/30 rounded-lg border border-cyan-700/50">
            <span class="font-medium text-cyan-300">Full CRUD</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.sqliteCrud?.status || 'pending')}>
                {getStatusIcon(testResults.sqliteCrud?.status || 'pending')}
              </span>
              <button
                onclick={testSqliteCrud}
                class="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filesystem Tests -->
      <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
        <h2 class="text-xl font-semibold mb-4 text-neutral-100">📁 Filesystem (Plugin)</h2>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Write File</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.fsWrite?.status || 'pending')}>
                {getStatusIcon(testResults.fsWrite?.status || 'pending')}
              </span>
              <button
                onclick={testFsWrite}
                class="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Read File</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.fsRead?.status || 'pending')}>
                {getStatusIcon(testResults.fsRead?.status || 'pending')}
              </span>
              <button
                onclick={testFsRead}
                class="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">File Exists</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.fsExists?.status || 'pending')}>
                {getStatusIcon(testResults.fsExists?.status || 'pending')}
              </span>
              <button
                onclick={testFsExists}
                class="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Delete File</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.fsDelete?.status || 'pending')}>
                {getStatusIcon(testResults.fsDelete?.status || 'pending')}
              </span>
              <button
                onclick={testFsDelete}
                class="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-fuchsia-900/30 rounded-lg border border-fuchsia-700/50">
            <span class="font-medium text-fuchsia-300">Full CRUD</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.fsCrud?.status || 'pending')}>
                {getStatusIcon(testResults.fsCrud?.status || 'pending')}
              </span>
              <button
                onclick={testFsCrud}
                class="bg-fuchsia-700 hover:bg-fuchsia-600 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Tests -->
      <div class="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
        <h2 class="text-xl font-semibold mb-4 text-neutral-100">⚡ Advanced Tests</h2>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Async (1s delay)</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.async?.status || 'pending')}>
                {getStatusIcon(testResults.async?.status || 'pending')}
              </span>
              <button
                onclick={testAsyncDelay}
                class="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
            <span class="font-medium text-neutral-200">Error Handling</span>
            <div class="flex items-center space-x-2">
              <span class={getStatusColor(testResults.error?.status || 'pending')}>
                {getStatusIcon(testResults.error?.status || 'pending')}
              </span>
              <button
                onclick={testErrorHandling}
                class="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Results Panel -->
    <div class="mt-8 rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
      <h2 class="text-xl font-semibold mb-4 text-neutral-100">📊 Test Results</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
        {#each Object.entries(testResults) as [testName, result]}
          <div class="p-3 bg-neutral-700/30 rounded-lg">
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium capitalize text-sm text-neutral-200">{testName}</span>
              <div class="flex items-center space-x-2">
                <span class={getStatusColor(result.status)}>
                  {getStatusIcon(result.status)}
                </span>
                {#if result.duration !== undefined}
                  <span class="text-xs text-neutral-500">({result.duration}ms)</span>
                {/if}
              </div>
            </div>
            {#if result.result}
              <div class="text-xs bg-neutral-800 text-neutral-300 p-2 rounded mt-2 break-all max-h-20 overflow-y-auto">
                {result.result}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Footer with stats -->
    <div class="mt-6 p-4 rounded-xl border border-neutral-700 bg-neutral-800/50">
      <div class="flex justify-between items-center text-sm">
        <span class="text-neutral-400">Tests: {Object.keys(testResults).length}</span>
        <span class="text-green-500">
          ✅ Passed: {Object.values(testResults).filter(r => r.status === 'success').length}
        </span>
        <span class="text-red-500">
          ❌ Failed: {Object.values(testResults).filter(r => r.status === 'error').length}  
        </span>
        <span class="text-blue-500">
          ⏳ Running: {Object.values(testResults).filter(r => r.status === 'running').length}
        </span>
        <span class="text-neutral-500">
          ⚪ Pending: {Object.values(testResults).filter(r => r.status === 'pending').length}
        </span>
      </div>
    </div>
  </div>
</div>
