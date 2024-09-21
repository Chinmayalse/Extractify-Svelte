<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import type { ActionData, PageData } from './$types';
    
    export let data: PageData;
    export let form: ActionData;

    let showPassword = false;
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
    <div class="w-full max-w-md" in:fly={{ y: 50, duration: 1000, easing: quintOut }}>
        <div class="bg-white shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div class="px-8 py-10">
                <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-6" in:scale={{ duration: 500, delay: 300 }}>
                    Welcome Back
                </h2>

                {#if form?.fail || data?.fail}
                    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" in:fade={{ duration: 300 }}>
                        <p>{data.fail ? "Something went wrong with OAuth!" : form?.message}</p>
                    </div>
                {/if}

                <form action="?/login" method="post" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">E-Mail</label>
                        <input id="email" name="email" type="email" required class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-black" placeholder="mail@example.com">
                    </div>
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <div class="mt-1 relative">
                            <input id="password" name="password" type={showPassword ? 'text' : 'password'} required class="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-black" placeholder="******">
                            <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" on:click={() => showPassword = !showPassword}>
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    

                    <div class="flex items-center justify-between">
                        <button class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300" formnovalidate formaction="?/reset">Reset Password</button>
                    </div>

                    <div>
                        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                            Login
                        </button>
                    </div>

                    <div>
                        <a href="/register" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                            Register
                        </a>
                    </div>
                </form>

                <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-800">Or continue with</span>
                        </div>
                        
                    </div>

                    <div class="mt-6 ml-30 grid grid-cols-1 gap-4 justify-center align-center w-full">
                        {#each data.providers as provider, i}
                        <form method="post" class="flex justify-center">
                            <button class="flex items-center justify-center w-full p-4 bg-grey-500 hover:bg-grey-600 text-black font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105" formaction="?/{provider.name}">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" class="w-5 h-5 mr-2" />
                                {provider.displayName}
                            </button>
                        </form>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes gradient {
        0% {background-position: 0% 50%;}
        50% {background-position: 100% 50%;}
        100% {background-position: 0% 50%;}
    }

    :global(body) {
        background: linear-gradient(-45deg, #dfd9d7, #000000, #292e30, #dee0e0);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        color:black;
    }
    button {
        border: none;
        cursor: pointer;
        outline: none;
    }

    button:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
</style>