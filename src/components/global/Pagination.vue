<template>
    <div class="w-full flex">
        <nav aria-label="Page pagination" class="flex flex-col mx-auto">
            <div class="text-md text-black dark:text-black text-center mb-2">
                Showing <span class="font-semibold text-gray-900 dark:text-gray-900">{{ currentPage !== 1 ? (currentPage
                - 1)
                * 10 : '1'}}</span> to
                <span class="font-semibold  dark:text-gray-900">{{ currentPage === 1 ? currentPage + 9 : (currentPage
                - 1) * 10 + 10}}</span> of <span class="font-semibold dark:text-gray-900">{{ totalItems }}</span>
                Posts
            </div>
            <ul class="inline-flex -space-x-px">
                <li>
                    <button @click="previousPage" :disabled="currentPage === 1"
                        class="px-3 py-2 ml-0 leading-tight bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
                </li>
                <li v-for="page in pages" :key="page">
                    <button @click="goToPage(page)" :class="{ 'dark:bg-gray-300 dark:text-black': page == currentPage }"
                        class="px-3 py-2 leading-tight bg-white border border-gray-300  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{{
                            page
                        }}</button>
                </li>
                <li>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-3 py-2 leading-tight bg-white border border-gray-300 rounded-r-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { PropType } from 'vue'

const emit = defineEmits(["onPageChange"]);

const props = defineProps({
    totalItems: {
        type: Number as PropType<number>,
        required: true
    },
    itemsPerPage: {
        type: Number as PropType<number>,
        default: 10
    },
})

// Watch for props update
watch(() => props.totalItems, (first, second) => {
    if (first > 0) totalPages.value = Math.ceil(props.totalItems / props.itemsPerPage)
});

const currentPage = ref(1)
const totalPages = ref(0)

// Create an array from object where totalPages is a ref
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

// On page mounted update the totalPages value from the props
const updateTotalPages = () => {
    totalPages.value = Math.ceil(props.totalItems / props.itemsPerPage)
}

// On page number click change the pagination page
const goToPage = (page: number) => {
    currentPage.value = page;
    emit("onPageChange", page)
}

// Change next and previous page
const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        emit("onPageChange", currentPage.value, 'previous')
    }
}
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        emit("onPageChange", currentPage.value, 'next')
    }
}
onMounted(updateTotalPages)

</script>