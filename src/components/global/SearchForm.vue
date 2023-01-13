<template>
    <!-- Input search form start -->
    <form class="search-form mx-auto">
        <label for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconZoom />
            </div>
            <input type="search" id="default-search" @input="handleInputEvent"
                class="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Posts by Users..." required />
        </div>
    </form>
    <!-- Input search form end -->
</template>

<script setup lang="ts">
import IconZoom from "@/components/icons/IconZoom.vue";

const emit = defineEmits(["emitSearchingPosts"]);

const handleInputEvent = (event: Event) => {
    const ev = event.target as HTMLInputElement
    emit('emitSearchingPosts', ev.value)
}

</script>

<style scoped>

</style>