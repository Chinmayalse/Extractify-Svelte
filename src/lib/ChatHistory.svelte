<script lang="ts">
  import { onMount } from 'svelte';

  export let userEmail: string;

  let chatHistory: Array<{ id: string; message: string; response: string; created: string }> = [];
  let sessions: Array<{ id: string; session_id: string }> = [];
  let selectedSessionId: string | null = null;
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    console.log("ChatHistory component mounted, userEmail:", userEmail);
    await fetchSessions();
  });

  async function fetchSessions() {
    try {
      const response = await fetch(`http://localhost:8000/chat_sessions/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        sessions = await response.json();
      } else {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }
    } catch (err: unknown) {
      console.error('Error fetching sessions:', err);
      if (err instanceof Error) {
        error = `Failed to load sessions. Error: ${err.message}`;
      }
    }
  }

  async function fetchChatHistory(sessionId: string) {
    console.log("Fetching chat history for session:", sessionId);
    isLoading = true;  // Set loading state
    try {
      const response = await fetch(`http://localhost:8000/chat_history/session/${encodeURIComponent(sessionId)}`);
      if (response.ok) {
        chatHistory = await response.json();
        selectedSessionId = sessionId; // Set selected session ID for display
      } else {
        throw new Error(`Failed to fetch chat history: ${response.status}`);
      }
    } catch (err: unknown) {
      console.error('Error fetching chat history:', err);
      if (err instanceof Error) {
        error = `Failed to load chat history. Error: ${err.message}`;
      }
    } finally {
      isLoading = false;  // Reset loading state
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
</script>

<div class="chat-history">
  <h2>Chat Sessions</h2>
  {#if error}
    <p class="error">{error}</p>
  {:else if sessions.length === 0}
    <p>No chat sessions available.</p>
  {:else}
    <ul class="session-list">
      {#each sessions as session}
        <li class="session-item" on:click={() => fetchChatHistory(session.session_id)}>
          <span>Session ID: {session.session_id}</span>
        </li>
      {/each}
    </ul>
  {/if}

  {#if isLoading}
    <p class="loading">Loading messages...</p>
  {:else if selectedSessionId}
    <h2>Messages for Session ID: {selectedSessionId}</h2>
    {#each chatHistory as chat}
      <div class="chat-entry">
        <p class="timestamp">{formatDate(chat.created)}</p>
        <p class="user-message"><strong>You:</strong> {chat.message}</p>
        <p class="bot-response"><strong>AI:</strong> {chat.response}</p>
      </div>
    {/each}
  {/if}
</div>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
  .chat-history {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .session-list {
    list-style-type: none;
    padding: 0;
    color: black;
  }

  .session-item {
    cursor: pointer;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 5px 0;
    transition: background-color 0.3s ease;
    color: black;
  }

  .session-item:hover {
    background-color: #e3f2fd;
  }

  .chat-entry {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    color: black;
  }

  .timestamp {
    font-size: 0.8em;
    color: #888;
  }

  .user-message {
    background-color: #E3F2FD;
    padding: 10px;
    border-radius: 10px;
    margin: 5px 0;
    color: black;
  }

  .bot-response {
    background-color: #F1F3F4;
    padding: 10px;
    border-radius: 10px;
    margin: 5px 0;
    color: black;
  }

  .loading {
    color: #888;
    font-style: italic;
  }
</style>


