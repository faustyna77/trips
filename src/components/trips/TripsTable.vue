<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    trips: Object,
})

// Stan dla paginacji
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Stan dla sortowania
const sortColumn = ref('')
const sortDirection = ref('asc')

// Stan dla filtrowania
const filterName = ref('')
const filterContinent = ref('')
const filterCountry = ref('')
const filterPeriod = ref('') 
const filterPriceMin = ref('')
const filterPriceMax = ref('')

// Stan dla wyszukiwania
const searchQuery = ref('')

// Funkcja sortowania
const sortTrips = (column) => {
    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortColumn.value = column
        sortDirection.value = 'asc'
    }
    currentPage.value = 1
}

// Unikalne wartości dla filtrów
const continents = computed(() => {
    return [...new Set(props.trips.map(trip => trip.continent))].sort()
})

const countries = computed(() => {
    return [...new Set(props.trips.map(trip => trip.country))].sort()
})

// Przetwarzanie wycieczek (wyszukiwanie, filtrowanie, sortowanie)
const processedTrips = computed(() => {
    let result = [...props.trips]
    
    // Wyszukiwanie globalne
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(trip => 
            trip.name.toLowerCase().includes(query) ||
            trip.continent.toLowerCase().includes(query) ||
            trip.country.toLowerCase().includes(query)
        )
    }
    
    // Filtrowanie po nazwie wycieczki
    if (filterName.value) {
        result = result.filter(trip => 
            trip.name.toLowerCase().includes(filterName.value.toLowerCase())
        )
    }
    
    // Filtrowanie po kontynencie
    if (filterContinent.value) {
        result = result.filter(trip => trip.continent === filterContinent.value)
    }
    
    // Filtrowanie po kraju
    if (filterCountry.value) {
        result = result.filter(trip => trip.country === filterCountry.value)
    }
    
    // Filtrowanie po konkretnym okresie 
    if (filterPeriod.value !== '') {
        result = result.filter(trip => trip.period === Number(filterPeriod.value))
    }
    
    // Filtrowanie po cenie (min)
    if (filterPriceMin.value !== '') {
        result = result.filter(trip => trip.price >= Number(filterPriceMin.value))
    }
    
    // Filtrowanie po cenie (max)
    if (filterPriceMax.value !== '') {
        result = result.filter(trip => trip.price <= Number(filterPriceMax.value))
    }
    
    // Sortowanie
    if (sortColumn.value) {
        result.sort((a, b) => {
            let aVal = a[sortColumn.value]
            let bVal = b[sortColumn.value]
            
            // Dla ceny i okresu - sortowanie numeryczne
            if (sortColumn.value === 'price' || sortColumn.value === 'period') {
                aVal = Number(aVal)
                bVal = Number(bVal)
            }
            
            if (sortDirection.value === 'asc') {
                return aVal > bVal ? 1 : -1
            } else {
                return aVal < bVal ? 1 : -1
            }
        })
    }
    
    return result
})

// Paginacja
const paginatedTrips = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return processedTrips.value.slice(start, end)
})

const totalPages = computed(() => 
    Math.ceil(processedTrips.value.length / itemsPerPage.value)
)

// Reset strony przy zmianie filtrów
const resetPage = () => {
    currentPage.value = 1
}

// Funkcja czyszcząca filtry
const clearFilters = () => {
    searchQuery.value = ''
    filterName.value = ''
    filterContinent.value = ''
    filterCountry.value = ''
    filterPeriod.value = ''  // ← ZMIENIONE
    filterPriceMin.value = ''
    filterPriceMax.value = ''
    sortColumn.value = ''
    currentPage.value = 1
}
</script>

<template>
    <!-- Panel wyszukiwania i filtrowania -->
    <div class="p-4 bg-gray-50 dark:bg-gray-700 space-y-4">
        <!-- Wyszukiwanie globalne -->
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Wyszukiwanie globalne:</label>
            <input 
                v-model="searchQuery" 
                @input="resetPage"
                type="text" 
                placeholder="Szukaj po nazwie, kontynencie lub kraju..."
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
        </div>
        
        <!-- Filtry -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Filtr nazwy wycieczki -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nazwa wycieczki:</label>
                <input 
                    v-model="filterName" 
                    @input="resetPage"
                    type="text" 
                    placeholder="Filtruj po nazwie..."
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kontynent:</label>
                <select 
                    v-model="filterContinent" 
                    @change="resetPage"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                    <option value="">Wszystkie</option>
                    <option v-for="continent in continents" :key="continent" :value="continent">
                        {{ continent }}
                    </option>
                </select>
            </div>
            
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kraj:</label>
                <select 
                    v-model="filterCountry" 
                    @change="resetPage"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                    <option value="">Wszystkie</option>
                    <option v-for="country in countries" :key="country" :value="country">
                        {{ country }}
                    </option>
                </select>
            </div>
            
            <!-- Filtr okresu (konkretna liczba dni) ← ZMIENIONE -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Okres (dni):</label>
                <input 
                    v-model="filterPeriod" 
                    @input="resetPage"
                    type="number" 
                    placeholder="np. 7, 14..."
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
        </div>
        
        <!-- Drugi rząd filtrów - tylko Cena -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Filtry ceny -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cena min (PLN):</label>
                <input 
                    v-model="filterPriceMin" 
                    @input="resetPage"
                    type="number" 
                    placeholder="0"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cena max (PLN):</label>
                <input 
                    v-model="filterPriceMax" 
                    @input="resetPage"
                    type="number" 
                    placeholder="∞"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
        </div>
        
        <!-- Przycisk czyszczenia filtrów -->
        <button 
            @click="clearFilters"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
            Wyczyść filtry
        </button>
        
        <!-- Informacja o wynikach -->
        <div class="text-sm text-gray-600 dark:text-gray-300">
            Znaleziono: <strong>{{ processedTrips.length }}</strong> wycieczek
        </div>
    </div>

    <!-- Tabela -->
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortTrips('name')">
                    Nazwa wycieczki
                    <span v-if="sortColumn === 'name'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortTrips('continent')">
                    Kontynent
                    <span v-if="sortColumn === 'continent'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortTrips('country')">
                    Kraj
                    <span v-if="sortColumn === 'country'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortTrips('period')">
                    Okres
                    <span v-if="sortColumn === 'period'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                </th>
                <th scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortTrips('price')">
                    Cena
                    <span v-if="sortColumn === 'price'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="paginatedTrips.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Brak wycieczek spełniających kryteria
                </td>
            </tr>
            <tr v-for="trip in paginatedTrips" :key="trip.id"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ trip.name }}
                </th>
                <td class="px-6 py-4">{{ trip.continent }}</td>
                <td class="px-6 py-4">{{ trip.country }}</td>
                <td class="px-6 py-4">{{ trip.period }} dni</td>
                <td class="px-6 py-4">{{ trip.price }} PLN</td>
            </tr>
        </tbody>
    </table>

    <!-- Paginacja -->
    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700">
        <div class="text-sm text-gray-600 dark:text-gray-300">
            Strona {{ currentPage }} z {{ totalPages }} (wyświetlane {{ paginatedTrips.length }} z {{ processedTrips.length }})
        </div>
        
        <div class="flex gap-2">
            <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Poprzednia
            </button>
            
            <span class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages || totalPages === 0"
                :class="currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Następna
            </button>
        </div>
        
        <div>
            <label class="text-sm text-gray-600 dark:text-gray-300 mr-2">Wyników na stronie:</label>
            <select 
                v-model.number="itemsPerPage" 
                @change="resetPage"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
            </select>
        </div>
    </div>
</template>