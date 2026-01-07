<script setup>
    import Navbar from '@/components/shared/Navbar.vue'
    import Footer from '@/components/shared/Footer.vue'

    import {RouterView} from 'vue-router'
</script>

<template>
    <Navbar />
    <RouterView />
    <Footer />
</template>

<style scoped>

</style>
