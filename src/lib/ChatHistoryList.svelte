<!-- <script>
    import { onMount } from 'svelte';
    import { chatHistory } from '$lib/chatHistory';
    import { fetchChatHistory } from '../utils/fetchChatHistory';

    let history = [];

    // Subscribe to the chatHistory store
    const unsubscribe = chatHistory.subscribe(value => {
        history = value;
    });

    // Fetch chat history when the component is mounted
    onMount(() => {
        fetchChatHistory();
    });

    // Unsubscribe from the store when the component is destroyed
    onDestroy(() => {
        unsubscribe();
    });
</script>

<section class="recent-activity">
    <h2>Recent Activity</h2>
    {#if history.length > 0}
        <ul>
            {#each history as chat}
                <li>
                    <p><strong>User:</strong> {chat.userMessage}</p>
                    <p><strong>Bot:</strong> {chat.botResponse}</p>
                    <small>{new Date(chat.timestamp).toLocaleString()}</small>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No recent activity found.</p>
    {/if}
</section>

<style>
    .recent-activity {
        padding: 1em;
    }

    .recent-activity ul {
        list-style-type: none;
        padding: 0;
    }

    .recent-activity li {
        margin-bottom: 1em;
        padding: 1em;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .recent-activity p {
        margin: 0;
    }

    .recent-activity small {
        display: block;
        margin-top: 0.5em;
        color: gray;
    }
</style> -->
