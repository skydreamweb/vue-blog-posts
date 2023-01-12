<template>
    <div
        class="h-full w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <Suspense>
            <template #default>
                <div class="h-full">
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
                    <div class="mb-2 mt-2 text-md font-semibold tracking-tight dark:text-white">Number of comments: {{
                        allComments.length
                    }}
                    </div>
                    <div v-if="updatingValue > 0">
                        <div class="flex flex-wrap w-full justify-between mb-6">
                            <div v-for="(comments, index) of allComments" :key="index"
                                class="my-2 flex flex-col  dark:text-white last:mb-4">
                                <hr />
                                <span class="font-bold my-2">&#9655; User: {{
                                    capitalizeFirstLetter(comments.name)
                                }}</span>
                                <span class="dark:text-gray-400">{{
                                    capitalizeFirstLetter(comments.body).slice(0, 130)
                                }}...</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="mb-2 mt-2 text-xl font-semibold tracking-tight dark:text-white">
                        {{ commentsMessage }}
                    </div>
                    <Button @buttonClicked="handleButtonClick(post.id)" class="absolute bottom-0 right-4" />
                </div>
            </template>
            <template #fallback>
                Loading...
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { ref, reactive } from 'vue'
import { usePosts } from '../../stores/posts'
import Button from "../global/Button.vue";
import IconMessage from "../icons/IconMessage.vue";
import { capitalizeFirstLetter } from '../../composables/helpers'

const props = defineProps<{
    post: {
        body: string;
        id: number;
        title: string;
        userId: number;
        userName: string;
    };
}>();

interface PostComments {
    postId: number,
    id: number;
    name: string;
    email: string;
    body: string;
}

let allComments: PostComments[] = reactive([])
const updatingValue = ref(0)
let commentsMessage = ref('Loading...')

// Initiate the store
const postStore = usePosts()

// Fetch comments
const postComments = await postStore.fetchSinglePostComments(props.post.id)
allComments = postComments as PostComments[]
updatingValue.value = 1;

// Open single post and save post/comments data to store
function handleButtonClick(id: number) {
    postStore.saveSinglePost(props.post, allComments)
    router.push({ path: `/posts/${id}` });
}
</script>

<style scoped>

</style>
