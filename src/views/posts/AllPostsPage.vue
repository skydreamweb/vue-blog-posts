<template>
    <div class="w-full">
        <Suspense>
            <template #default>
                <div>
                    <!-- Input search form start -->
                    <form class="search-form mx-auto">
                        <label for="default-search"
                            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <IconZoom />
                            </div>
                            <input type="search" id="default-search" v-model="search"
                                class="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search Posts by Users..." required />
                        </div>
                    </form>
                    <!-- Input search form end -->

                    <!-- All posts rendered start -->
                    <div class="flex flex-wrap w-full justify-between mb-6" v-if="!search.length">
                        <div class="p-0 m-0 flex flex-wrap">
                            <div v-for="post of itemsOnCurrentPage.itemsOnPage" :key="post.id"
                                class="my-2 px-4 md:w-1/2">
                                <SinglePost :post="post" />
                            </div>
                        </div>
                        <Pagination v-if="!search.length" :totalItems="100" :itemsPerPage="itemsPerPage" class="mt-6"
                            @onPageChange="handlePageChange" />
                    </div>
                    <!-- All posts rendered end  -->

                    <div v-else>
                        <div v-if="isLoading" class="p-0 m-0 flex flex-wrap">
                            <div v-for="post of itemsOnCurrentPage.itemsOnPage" :key="post.id" class="my-2 px-4 w-1/2">
                                <SinglePost :post="post" />
                            </div>
                        </div>
                        <div v-else class="p-0 m-0 flex flex-wrap mx-auto">
                            <Loading />
                        </div>
                    </div>
                </div>
            </template>
            <template #fallback>
                <Loading />
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type Types from '../../types/post'
import { usePosts } from "../../stores/posts";
import Pagination from "../../components/global/Pagination.vue";
import Loading from "../../components/global/Loading.vue";
import SinglePost from "../../components/post/SinglePost.vue";
import IconZoom from "../../components/icons/IconZoom.vue";

const currentPage = ref(1);
const itemsPerPage = ref(10);
const search = ref("");
const isLoading = ref(false);
let timeoutId: number | null = null;

const performSearch = async (value: any) => {
    const fetchUsers = fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json() as Promise<Types.User[]>)
        .then(response => {
            // do something with the data
            const filteredUsers = response.filter(
                user =>
                    user.name.toLowerCase().includes(value.toLowerCase()) ||
                    user.username.toLowerCase().includes(value.toLowerCase()) ||
                    user.email.toLowerCase().includes(value.toLowerCase())
            );
            isLoading.value = false;
            return filteredUsers;
        });
    console.log(fetchUsers);
};

// Watch for user search input and delay request for 500ms
watch(
    () => search.value,
    newValue => {
        if (newValue) isLoading.value = true;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            performSearch(newValue);
        }, 500);
    }
);

// Initiate the store
const postStore = usePosts();

// Call the store method
async function getAllData() {
    await postStore.fetchChunkOfPosts(currentPage.value - 1);
    await postStore.fetchAllPosts();
}

// Return chunk of posts from the store state
const chunkPosts = postStore.getChunk() as Types.Post[];
const allPosts = postStore.getState();

// Pagination
const itemsOnCurrentPage = computed(() => {
    return {
        itemsOnPage: chunkPosts,
        allPosts: allPosts
    };
});

// Change the pagination page
async function handlePageChange(page: number) {
    currentPage.value = page;
    // Call the store method
    await postStore.fetchChunkOfPosts((currentPage.value - 1) * 10);
}

onMounted(getAllData);
</script>

<style scoped>
.search-form {
    width: 20rem;
}
</style>
