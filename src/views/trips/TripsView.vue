<script setup>
    import Carousel from '@/components/shared/Carousel.vue'
    import Trips from '@/components/trips/Trips.vue'
</script>

<template>
    <Carousel :images="['img/carousel1.jpg', 'img/carousel2.jpg', 'img/carousel3.jpg']" />
    <Trips :limit="4"/>
</template>