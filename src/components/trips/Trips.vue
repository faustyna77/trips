<script setup>
    import tripsData from '@/trips.json'
    import { ref } from 'vue'
    import TripCard from '@/components/trips/TripCard.vue'
    import TripsTable from '@/components/trips/TripsTable.vue'

    const trips = ref(tripsData)

    defineProps({
        limit: {
            type: Number,
            default: 4
        }
    })

</script>

<template>
  <!-- <div id="wycieczki" class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
    <h1 class="text-3xl font-bold dark:text-white"> Wycieczki </h1>
    <div class="place-items-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      <TripCard v-for="trip in [...trips].sort(() => .5 - Math.random()).slice(0, limit)" :key="trip.id" :trip="trip" />
    </div>
  </div> -->

  <div id="cennik" class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
    <h1 class="text-3xl font-bold dark:text-white"> Cennik </h1>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <TripsTable :trips="trips" />
    </div>
  </div>
</template>
