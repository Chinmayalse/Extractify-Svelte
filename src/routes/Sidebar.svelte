<script lang="ts">
    export let sessions: Array<{ id: string; session_id: string }>;
    export let error: string | null;
    export let onSessionSelect: (sessionId: string) => Promise<void>;
  
    function handleSessionSelect(sessionId: string) {
      onSessionSelect(sessionId);
    }
  </script>
  
  <div class="sidebar">
    <h2>Chat Sessions</h2>
    {#if error}
      <p class="error">{error}</p>
    {:else if sessions.length === 0}
      <p>No chat sessions available.</p>
    {:else}
      <ul class="session-list">
        {#each sessions as session}
          <li class="session-item" on:click={() => handleSessionSelect(session.session_id)}>
            <span>Session ID: {session.session_id}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  
  <style>
    .sidebar {
      width: 250px; /* Fixed width for the sidebar */
      padding: 20px;
      background-color: #f1f1f1;
      border-right: 1px solid #ccc;
      overflow-y: auto; /* Scrollable if content overflows */
    }
    
    .session-list {
      list-style-type: none;
      padding: 0;
    }
  
    .session-item {
      cursor: pointer;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin: 5px 0;
      transition: background-color 0.3s ease;
    }
  
    .session-item:hover {
      background-color: #e3f2fd;
    }
  
    .error {
      color: red;
      font-weight: bold;
    }
  </style>
  