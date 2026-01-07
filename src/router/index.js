import { createWebHistory, createRouter } from 'vue-router'

import TripsView from '@/views/trips/TripsView.vue'
import TripView from '@/views/trips/TripView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'trips', component: TripsView },
  { path: '/trips/:id', name: 'trip', component: TripView },
  
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router;
