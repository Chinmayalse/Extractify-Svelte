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
                    Create Account
                </h2>

                <!-- {#if form?.fail || data?.fail}
                    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" in:fade={{ duration: 300 }}>
                        <p>{data.fail ? "Registration failed!" : form?.message}</p>
                    </div>
                {/if} -->

                <form action="?/register" method="post" class="space-y-6">
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
                    

                    <div>
                        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                            Register
                        </button>
                    </div>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">Already have an account? <a href="/login" class="text-indigo-600 hover:text-indigo-500">Log In</a></p>
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
    }
</style>
