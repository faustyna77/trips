<script setup>
    import { RouterLink } from 'vue-router'
</script>

<template>
  <div id="wycieczki" class="w-full max-w-screen-xl mx-auto p-4 md:py-8 mt-16 text-center">
    <h1 class="text-5xl font-bold mb-4 dark:text-gray-400">404 &ndash; Not Found</h1>
    <p class="text-xl mb-5 dark:text-gray-400">This page doesn't exist</p>
    <RouterLink :to="{ name: 'trips' }" 
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg 
        text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Powrót na stronę główną
    </RouterLink>
  </div>
</template>