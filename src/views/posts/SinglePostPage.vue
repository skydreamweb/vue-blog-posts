<template>
    <div class="page-content px-2">
        <div v-if="postContent.post.id"
            class="h-full w-full py-3 px-2 md:p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-between">
                <span class="dark:text-white flex justify-center text-xs md:text-base">
                    Author: {{ postContent.post.userName }} <br /> Email: {{ postContent.post.userEmail }}
                </span>
                <IconMessage />
            </div>
            <div class="py-2 md:py-1">
                <h5 class="my-2 md:my-6 text-md md:text-2xl font-semibold tracking-tight dark:text-white">
                    {{ capitalizeFirstLetter(postContent.post.title) }}
                </h5>
            </div>
            <p class="mb-6 text-sm md:text-lg font-normal dark:text-gray-400">
                {{ capitalizeFirstLetter(postContent.post.body) }}
            </p>
            <div>
                <div class="dark:text-white text-sm md:text-base">Comments</div>
                <div class="flex flex-wrap w-full justify-between mb-6">
                    <div v-for="(comments, index) of postContent.comments" :key="index"
                        class="my-2 flex flex-col  dark:text-white last:mb-4">
                        <hr />
                        <span class="font-bold my-2 text-sm md:text-lg">&#9655; User: {{
                            capitalizeFirstLetter(comments.name)
                        }}</span>
                        <span class="dark:text-gray-400 text-xs md:text-base">{{
                            capitalizeFirstLetter(comments.body)
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="my-6 text-md font-semibold tracking-tight dark:text-white text-sm md:text-md">Number of
                comments: {{
                    postContent.comments.length
                }}
            </div>
            <Button @buttonClicked="$router.go(-1)" title="Back to posts" class="absolute bottom-4 right-4" />
        </div>
        <div v-else class="text-2xl font-semibold">
            Post not found :(
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { usePosts } from '../../stores/posts'
import Button from "../../components/global/Button.vue";
import IconMessage from "../../components/icons/IconMessage.vue";
import { useRoute } from 'vue-router'
import { capitalizeFirstLetter } from '../../composables/helpers'
const route = useRoute()

interface PostComments {
    postId: number,
    id: number;
    name: string;
    email: string;
    body: string;
}
interface PostsState {
    body: string;
    id: number | null;
    title: string;
    userId: number | null;
    userName?: string;
    userEmail?: string;
}

interface SinglePostState {
    post: PostsState;
    comments: PostComments[];
}

// Initiate the store
const postStore = usePosts()
const singlePost = postStore.getSinglePostFromStore();

let postContent = reactive<SinglePostState>({
    post: { id: null, title: '', body: '', userId: null },
    comments: []
});

// If post doesn't exist in store render from the server
if (!singlePost.post.id || !singlePost.comments.length) {
    async function getSinglePost() {
        // Fetch single post, post comments and user info
        const singlePost = await postStore.fetchSinglePost(Number(route.params.id))
        const postComments = await postStore.fetchSinglePostComments(singlePost.id)
        const singleUser = await postStore.fetchSingleUser(singlePost.id)

        // Assigne to new object to render in template
        postContent.post = singlePost;
        postContent.post.userName = singleUser.name;
        postContent.post.userEmail = singleUser.email;
        postContent.comments = postComments;
    }
    getSinglePost()
    // else render from the store
} else {
    postContent = singlePost as SinglePostState
}
</script>

<style scoped>
.page-content {
    max-width: 960px;
}
</style>