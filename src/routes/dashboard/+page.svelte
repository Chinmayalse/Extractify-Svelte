<script lang="ts">
    import type { PageData } from './$types';
    import { fade, fly, scale } from 'svelte/transition';
    import { elasticOut } from 'svelte/easing';
    import Chatbot from '$lib/Chatbot.svelte';
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    import ChatHistory from '$lib/ChatHistory.svelte';

    export let data: PageData;

    let extractedText: string = '';
    let correctedText: string = '';
    let isLoading: boolean = false;
    let error: string | null = null;
    let jsonData: any = null;
    let fileName: string = '';
    let copySuccess: boolean = false;
    let showChatbot = false;
    let chatHistory = [];
    let userEmail = data.user?.email || null;
    let showChatHistory = false;
    export let extractedData: any;

    $: console.log("Current userEmail:", userEmail);

    
    async function handleFileUpload(event: Event) {
        event.preventDefault();
        const fileInput = (event.target as HTMLFormElement).elements.namedItem('fileInput') as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (file) {
            const formData = new FormData();
            formData.append('pdf_file', file);

            if (file.type === 'application/pdf') {
                isLoading = true;
                error = null;
                try {
                    const response = await fetch('http://localhost:8000/process_pdf', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }

                    const data = await response.json();
                    extractedText = data.extracted_text || 'No text extracted.';
                    correctedText = data.corrected_text || 'No corrected text available.';
                    jsonData = data.json_data || null;
                    
                    console.log("Extracted JSON data:", jsonData);  // For debugging
                    
                    if (jsonData) {
                        showChatbot = true;  // Automatically show chatbot when data is available
                    }
                } catch (err) {
                    console.error('Error:', err);
                    error = 'Failed to process the PDF. Please try again.';
                    extractedText = '';
                    correctedText = '';
                    jsonData = null;
                    showChatbot = false;
                } finally {
                    isLoading = false;
                }
            } else {
                error = 'Unsupported file type. Please upload a .pdf file.';
                extractedText = '';
                correctedText = '';
            }
        }
    }

    function formatMarkdown(text: string): string {
        return text.replace(/\|/g, '</td><td>')
                   .replace(/^/gm, '<tr><td>')
                   .replace(/$/gm, '</td></tr>')
                   .replace(/\n/g, '');
    }

    function downloadJSON() {
        console.log('Download JSON clicked', jsonData);
        if (jsonData) {
            const dataStr = JSON.stringify(jsonData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'extracted_results.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            console.log('No JSON data available');
        }
    }

    function handleFileSelect(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            fileName = fileInput.files[0].name;
        } else {
            fileName = '';
        }
    }

    function toggleChatbot() {
        if (jsonData) {
            showChatbot = !showChatbot;
        } else {
            alert("Please upload and process a document first.");
        }
    }
    // Add this function to safely access nested properties
    function safelyGetNestedProp(obj: any, path: string) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

onMount(() => {
    userEmail = safelyGetNestedProp(data, 'user.email') || null;
});
function toggleChatHistory() {
    showChatHistory = !showChatHistory;
  }
</script>
<nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex-shrink-0 flex items-center">
                <span class="text-2xl font-bold text-indigo-600">Extractify</span>
            </div>
            <div class="flex items-center">
                {#if safelyGetNestedProp(data, 'user.email')}
                    <span class="text-gray-600 mr-4">{data.user.email}</span>
                {:else}
                    <span class="text-gray-600 mr-4">No user email available</span>
                {/if}
                <form action="/login?/logout" method="post">
                    <button class="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300">
                        Log Out
                    </button>
                </form>
            </div>
        </div>
        <!-- Chat History Display
        <div class="chat-history">
            {#each chatHistory as chat}
                <div class="chat-message">
                    <span class="timestamp">{new Date(chat.timestamp).toLocaleString()}</span>
                    <p>{chat.message}</p>
                </div>
            {/each}
        </div> -->
    </div>
</nav>

<div class="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
        <div class="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div class="px-6 py-8">
                <!-- <h1 class="text-4xl font-extrabold text-center text-gray-900 mb-8">PDF Text Extractor</h1> -->
                
                <form on:submit={handleFileUpload} class="space-y-6">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-all duration-300">
                        <input id="fileInput" type="file" name="fileInput" accept=".pdf" class="hidden" on:change={handleFileSelect} />
                        <label for="fileInput" class="cursor-pointer flex flex-col items-center space-y-2">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <span class="text-sm font-medium text-gray-600">
                                {fileName ? fileName : 'Click to upload or drag and drop'}
                            </span>
                            <span class="text-xs text-gray-500">PDF up to 10MB</span>
                        </label>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Extract Text'}
                    </button>
                </form>
            </div>
            
            {#if isLoading}
                <div class="px-6 py-4 bg-gray-50" in:fade>
                    <div class="flex items-center justify-center space-x-2">
                        <div class="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                        <div class="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                    <p class="mt-2 text-center text-gray-600">Processing PDF, please wait...</p>
                </div>
            {:else if error}
                <div class="px-6 py-4 bg-red-50 border-t border-red-200" in:fly="{{ y: 20, duration: 500 }}" out:fade>
                    <p class="text-red-600 font-semibold">{error}</p>
                </div>
            {:else if correctedText}
                <div class="px-6 py-8 bg-gray-50 border-t border-gray-200" in:fly="{{ y: 20, duration: 500 }}" out:fade>
                    <h2 class="text-2xl font-bold mb-4 text-indigo-700">Corrected and Formatted Results</h2>
                    <div class="bg-white rounded-lg shadow overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <tbody class="text-sm text-gray-700">
                                    {@html formatMarkdown(correctedText)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-center space-x-4">
                        {#if jsonData}
                            <button on:click={downloadJSON} class="bg-green-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300" in:scale="{{ duration: 300, easing: elasticOut }}">
                                Download JSON
                            </button>
                        {/if}
                        
                        {#if jsonData}
                            <button 
                                on:click={toggleChatbot} 
                                class="bg-indigo-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                            >
                                {showChatbot ? 'Hide AI Assistant' : 'Chat with AI Assistant'}
                            </button>
                        {/if}

                        {#if userEmail}
                        <button 
                          on:click={toggleChatHistory} 
                          class="bg-blue-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                        >
                          {showChatHistory ? 'Hide Chat History' : 'View Chat History'}
                        </button>
                      {/if}

                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
{#if showChatbot}
  <div class="fixed bottom-4 right-4 z-50" transition:fly={{ y: 50, duration: 300 }}>
    <Chatbot
      extractedData={jsonData}
      {userEmail}
      on:close={() => showChatbot = false}
    />
  </div>
{/if}

{#if showChatHistory}
  <div class="mt-8" transition:fade>
    <ChatHistory userEmail={userEmail} />
  </div>
{/if}
<style>
    .loader {
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
        50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
    }
    .animate-bounce {
        animation: bounce 1s infinite;
    }
</style>