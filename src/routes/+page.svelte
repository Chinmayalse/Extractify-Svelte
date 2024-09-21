<script>
	let isLoggedIn = false; // You can manage this state based on your authentication logic
  </script>
  
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
	<div class="bg-white p-8 rounded-lg shadow-lg text-center">
	  <h1 class="text-4xl font-bold text-blue-600 mb-6">Welcome to Extractify</h1>
	  <p class="text-lg text-gray-700 mb-8">
		Please continue to log in to use the services.
	  </p>
  
	  {#if isLoggedIn}
		<form action="/login?/logout" method="post">
		  <button class="btn variant-filled bg-red-600 text-white py-2 px-6 rounded hover:bg-red-500 transition-all">
			Log Out
		  </button>
		</form>
	  {:else}
		<a href="/login" class="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-500 transition-all">
		  Log In
		</a>
	  {/if}
	</div>
  </div>
  