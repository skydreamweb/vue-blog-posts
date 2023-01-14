<template>
    <div class="w-full">
        <Suspense>
            <template #default>
                <div>
                    <SearchForm @emitSearchingPosts="searchingPosts" />
                    <!-- All posts rendered start -->
                    <div class="flex flex-wrap w-full justify-between mb-6" v-if="!isSearching">
                        <div class="p-0 m-0 flex flex-wrap">
                            <div v-for="post of itemsOnCurrentPage" :key="post.id" class="my-2 px-4 md:w-1/2">
                                <SinglePost :post="post" />
                            </div>
                        </div>
                        <Pagination v-if="!search.length" :totalItems="numberOfPosts" :itemsPerPage="itemsPerPage"
                            class="mt-6" @onPageChange="handlePageChange" />
                    </div>
                    <!-- All posts rendered end  -->

                    <div v-else>
                        <div v-if="!isLoading" class="p-0 m-0">
                            <div v-if="filteredResults?.length" class="flex flex-wrap">
                                <div v-for="post of filteredResults" :key="post.id" class="my-2 px-4 md:w-1/2">
                                    <SinglePost :post="post" />
                                </div>
                            </div>
                            <div class="flex text-2xl justify-center mx-auto mt-6" v-else>
                                No user posts.
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
import Pagination from "@/components/global/Pagination.vue";
import Loading from "@/components/global/Loading.vue";
import SinglePost from "@/components/post/SinglePost.vue";
import SearchForm from '@/components/global/SearchForm.vue'

const currentPage = ref(1);
const itemsPerPage = ref(10);
const numberOfPosts = ref(0)
const search = ref("");
const isSearching = ref(false)
const isLoading = ref(false);
let timeoutId: number | null = null;
let filteredResults = ref<Types.Post[]>();

// Custom debounce function can be replaced with the _loadash debounce function
const searchingPosts = (value: string) => {
    if (value.length > 0) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            isSearching.value = true;
            isLoading.value = true;
            performSearch(value);
        }, 500);
    } else {
        isSearching.value = false;
        isLoading.value = false;
    }
}

// Perform search on user input
const performSearch = async (value: string) => {
    // Fetch all users
    const allUsers = await postStore.fetchAllUsers()
    // Filter user data with input string
    const filteredUsers = allUsers.filter(
        (user: Types.User) =>
            // check with .includes() or regex
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
    );

    // If there are users fetch posts and comments
    if (filteredUsers.length) {
        const allPostsPromises = filteredUsers.map(async (user: Types.User) => {
            // Fetch all posts of single a user
            const singleUserPost = await postStore.fetchSingleUserPost(user.id)
            // Add userId, userName and userEmail to user object
            singleUserPost.map((post: Types.Post) => {
                post.userId = user.id;
                post.userEmail = user.email;
                post.userName = user.name;
            });
            return singleUserPost
        });
        const flattenedValue = await Promise.all(allPostsPromises)

        // Assign filtered posts to filter results to render
        filteredResults.value = flattenedValue[0];
    } else {
        // If no filtered posts return empty array
        filteredResults.value = []
    }
    isLoading.value = false;
};

// Initiate the store
const postStore = usePosts();

// Call the store method
async function getAllData() {
    await postStore.fetchChunkOfPosts(currentPage.value - 1);
    await postStore.fetchAllPosts();
    return postStore.getState();
}

// Return chunk of posts from the store state
const chunkPosts = postStore.getChunk() as Types.Post[];

// Return total number of posts
getAllData()
    .then(res => {
        numberOfPosts.value = res.length
    })
    .catch(err => console.log(err))

// Pagination
const itemsOnCurrentPage = computed(() => chunkPosts);

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
