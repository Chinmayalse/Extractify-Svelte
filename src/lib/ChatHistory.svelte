<script lang="ts">
  import { onMount } from 'svelte';

  export let userEmail: string;

  let chatHistory: Array<{ id: string; message: string; response: string; created: string }> = [];
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    console.log("ChatHistory component mounted, userEmail:", userEmail);
    await fetchChatHistory();
  });

  async function fetchChatHistory() {
  console.log("Fetching chat history for:", userEmail);
  try {
    const response = await fetch(`http://localhost:8000/chat_history/${encodeURIComponent(userEmail)}`);
    console.log("Response status:", response.status);
    if (response.ok) {
      chatHistory = await response.json();
      console.log("Fetched chat history:", chatHistory);
    } else {
      const errorText = await response.text();
      throw new Error(`Failed to fetch chat history: ${response.status} ${errorText}`);
    }
  } catch (err: unknown) {
    console.error('Error fetching chat history:', err);
    if (err instanceof Error) {
      error = `Failed to load chat history. Error: ${err.message}`;
    } else {
      error = 'Failed to load chat history. An unknown error occurred.';
    }
  } finally {
    isLoading = false;
  }
}
function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
</script>

<div class="chat-history">
  <h2>Chat History</h2>
  {#if isLoading}
    <p>Loading chat history...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if chatHistory.length === 0}
    <p>No chat history available.</p>
  {:else}
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
    }
  
    .chat-entry {
      border-bottom: 1px solid #ccc;
      padding: 10px 0;
    }
  
    .timestamp {
      font-size: 0.8em;
      color: #666;
    }
  
    .user-message {
      background-color: #E3F2FD;
      padding: 5px 10px;
      border-radius: 10px;
      margin: 5px 0;
      color:black;
    }
  
    .bot-response {
      background-color: #F1F3F4;
      padding: 5px 10px;
      border-radius: 10px;
      margin: 5px 0;
      color:black;
    }
  
    .error {
      color: red;
    }
  </style>