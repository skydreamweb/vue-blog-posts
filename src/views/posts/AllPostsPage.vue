<template>
    <div class="w-full">
        <Suspense>
            <template #default>
                <div>
                    <div class="flex flex-wrap w-full justify-between mb-6">
                        <div v-for="post of allPosts" :key="post.id" class="my-2 px-4 w-1/2">
                            <SinglePost :post="post" />
                        </div>
                    </div>
                </div>
            </template>
            <template #fallback>
                Loading...
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePosts } from '../../stores/posts'
import SinglePost from '../../components/post/SinglePost.vue'

type Post = {
    body: string;
    id: number;
    title: string;
    userId: number;
    userName: string;
}

// Initiate the store
const postStore = usePosts()

// Call the store method
await postStore.fetchAllPosts()
const allPosts = postStore.getState() as Post[]

</script>

<style scoped>

</style>