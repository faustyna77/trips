<script setup>  
    import { ref, reactive, onMounted } from 'vue'
    import { useRoute } from 'vue-router'

    import tripsData from '@/trips.json'
    const trip = ref(tripsData).value[useRoute().params.id - 1]

    onMounted(async () => {

    })    

</script>

<template>
   <div id="" class="w-full max-w-screen-xl mx-auto p-4 md:py-8 mt-16">
    <h1 class="text-3xl font-bold dark:text-white"> Wycieczka </h1>
    <div class="flex justify-center items-center">
      <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mt-4">
        <img class="rounded-t-lg" :src="'/img/' + trip.img" alt="" />
        <div class="p-5">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ trip.name }}</h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ trip.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>