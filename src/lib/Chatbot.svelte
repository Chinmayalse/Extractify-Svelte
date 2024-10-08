<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let extractedData: any;
  // export let jsonData: any;  // Add type definition for jsonData
    export let userEmail: string;

  const dispatch = createEventDispatcher();

  interface Conversation {
  message: string;
  response: string;
  timestamp: string;
}

let messages: Array<{ text: string; sender: 'user' | 'bot' }> = [];
  let inputMessage = '';
  let isLoading = false;
  let sessionId = "";

  async function getSessionId() {
        const response = await fetch("http://localhost:8000/start_session");
        const data = await response.json();
        sessionId = data.session_id;  // Store the session ID
    }
    // onMount(() => {
    //     getSessionId();
    // });
  

  onMount(async () => {
    await getSessionId();  // Ensure session ID is fetched before sending messages
    if (userEmail) {
      await fetchPreviousConversations();
    }
  });

async function fetchPreviousConversations() {
  try {
    const response = await fetch(`http://localhost:8000/previous_conversations/${encodeURIComponent(userEmail)}`);
    if (response.ok) {
      const previousConversations: Conversation[] = await response.json();
      messages = previousConversations.flatMap((conv: Conversation) => [
        { text: conv.message, sender: 'user' as const },
        { text: conv.response, sender: 'bot' as const }
      ]);
    } else {
      console.error('Failed to fetch previous conversations');
    }
  } catch (error) {
    console.error('Error fetching previous conversations:', error);
  }
}

async function sendMessage() {
  if (inputMessage.trim() === '') return;

  const userMessage = inputMessage;
  messages = [...messages, { text: userMessage, sender: 'user' }];
  inputMessage = '';
  isLoading = true;

  try {
    const response = await fetch('http://localhost:8000/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: userMessage, 
        extracted_data: extractedData,
        user_email: userEmail,
        session_id: sessionId
      })
    });

    if (response.ok) {
      const data = await response.json();
      messages = [...messages, { text: data.response, sender: 'bot' }];
    } else {
      console.error('Error response from server');
      messages = [...messages, { text: 'Sorry, there was an error processing your request.', sender: 'bot' }];
    }
  } catch (error) {
    console.error('Error sending message:', error);
    messages = [...messages, { text: 'Sorry, there was an error sending your message.', sender: 'bot' }];
  } finally {
    isLoading = false;
  }
}

onMount(async () => {
  if (userEmail) {
    try {
      const response = await fetch(`http://localhost:8000/previous_conversations/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const previousConversations: Array<{ message: string; response: string }> = await response.json();
        messages = previousConversations.flatMap(conv => [
          {
            text: conv.message,
            sender: 'user' as const
          },
          {
            text: conv.response,
            sender: 'bot' as const
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching previous conversations:', error);
    }
  }
});


  let showHistory = false;
  let chatHistory: Array<{ id: string; message: string; response: string; created: string }> = [];

  onMount(async () => {
    await fetchChatHistory();
  });

  async function fetchChatHistory() {
    try {
      const response = await fetch(`http://localhost:8000/chat_history/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        chatHistory = await response.json();
      } else {
        console.error('Failed to fetch chat history');
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }

  function toggleHistory() {
    showHistory = !showHistory;
  }

  function handleClose() {
    dispatch('close');
  }

  
</script>



<div class="chatbox" transition:fly="{{ y: 50, duration: 300 }}">
  <div class="chat-header">
    <h3>AI Assistant</h3>
    <button class="close-btn" on:click={handleClose}>&times;</button>
    
  </div>
  <div class="messages">
    {#each messages as message}
      <div class="message {message.sender}" transition:fade>
        {message.text}
      </div>
    {/each}
    {#if isLoading}
      <div class="message bot" transition:fade>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    {/if}
  </div>
  <div class="input-area">
    <input
      type="text"
      bind:value={inputMessage}
      on:keypress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
      placeholder="Ask about your test results..."
      disabled={isLoading}
    />
    <button on:click={sendMessage} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send'}
    </button>
  </div>
</div>

<style>
  .chatbox {
      width: 350px;
      height: 500px;
      border: 1px solid #ccc;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      background-color: #f9f9f9;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .chat-header {
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      font-weight: bold;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
  }

  .messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 10px;
  }

  .message {
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 18px;
      max-width: 80%;
      word-wrap: break-word;
  }

  .user {
      background-color: #E3F2FD;
      color: #000;
      align-self: flex-end;
      margin-left: auto;
  }

  .bot {
      background-color: #F1F3F4;
      color: #000;
      align-self: flex-start;
  }

  .input-area {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ccc;
      color:#000;
  }

  input {
      flex-grow: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 20px;
      font-size: 14px;
  }

  button {
      margin-left: 5px;
      padding: 8px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
  }

  button:hover {
      background-color: #45a049;
  }

  button:disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
  }

  .typing-indicator {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20px;
  }

  .typing-indicator span {
      height: 8px;
      width: 8px;
      background-color: #3498db;
      border-radius: 50%;
      display: inline-block;
      margin: 0 2px;
      animation: bounce 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) {
      animation-delay: -0.32s;
  }

  .typing-indicator span:nth-child(2) {
      animation-delay: -0.16s;
  }

  @keyframes bounce {
      0%, 80%, 100% { 
          transform: scale(0);
      } 40% { 
          transform: scale(1.0);
      }
  }
</style>