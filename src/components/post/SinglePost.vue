<template>
    <div
        class="h-full w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-between">
            <span class="dark:text-white flex justify-center">
                Author: {{ post.userName }}
            </span>
            <IconMessage />
        </div>
        <a href="#">
            <h5 class="mb-2 text-2xl font-semibold tracking-tight dark:text-white">
                {{ capitalizeFirstLetter(post.title) }}
            </h5>
        </a>
        <p class="mb-6 font-normal dark:text-gray-400">
            {{ capitalizeFirstLetter(post.body.slice(0, 70)) }}...
        </p>
        <hr />
        <Button class="absolute bottom-4 right-4" />
    </div>
</template>

<script setup lang="ts">
import Button from "../global/Button.vue";
import IconMessage from "../icons/IconMessage.vue";


const props = defineProps<{
    post: {
        body: string;
        id: number;
        title: string;
        userId: number;
        userName: string;
    };
}>();

// Capitalize first letter
function capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
</script>

<style scoped>

</style>
