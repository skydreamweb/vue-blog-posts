import { reactive, readonly, ref } from "vue";
import { useFetch } from '@vueuse/core'
import type Types from '../types/post'

export class PostStore {
    #allPosts;                // Private variable #allPosts keeps total number of posts
    #chunk: Types.PostsStateItems;  // Private variable #chunk keeps last 10 updated posts
    #singlePost: Types.SinglePostState; // Private variable #comments keeps all the comments from the single post

    constructor() {
        this.#chunk = reactive<Types.PostsStateItems>([]);
        this.#allPosts = ref(0);
        this.#singlePost = reactive<Types.SinglePostState>({
            post: { id: null, title: '', body: '', userId: null },
            comments: []
        });
    }

    getChunk() {
        return readonly(this.#chunk);
    }

    getSinglePostFromStore() {
        return readonly(this.#singlePost);
    }

    getState() {
        return readonly(this.#allPosts);
    }

    // Fetch paginated posts
    async fetchChunkOfPosts(start: number) {
        // Fetch all posts 10 by 10
        const fetchChunkOfPosts = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=10`);
        const fetchedPostData = await fetchChunkOfPosts.json() as Types.PostsStateItems

        // Fetch all users
        const fetchAllUsers = await fetch(`https://jsonplaceholder.typicode.com/users`);
        const fetchedUserData = await fetchAllUsers.json() as Types.UsersState[]

        // Loop and filter 'userId' from the posts with the 'id' from the users
        fetchedPostData.forEach(post => {
            fetchedUserData.forEach(({ id, name, email }) => {
                if (post.userId === id) {
                    post.userName = name;
                    post.userEmail = email;
                }
            });
        });

        // Use the splice method to remove all existing elements in the #chunk array and then insert the new data from the API into the array. This updates the #allPosts array while keeping it reactive.
        this.#chunk.splice(0, this.#chunk.length, ...fetchedPostData);
    }

    async fetchAllPosts() {
        const { isFetching, error, data } = await useFetch("https://jsonplaceholder.typicode.com/posts").get().json();
        this.#allPosts = data.value;
        return data.value;
    }

    // Fetch single post
    async fetchSinglePost(id: number) {
        const { isFetching, error, data } = await useFetch(`https://jsonplaceholder.typicode.com/posts/${id}`).get().json();
        return data.value;
    }

    // Fetch single post comments
    async fetchSinglePostComments(id: number) {
        const { isFetching, error, data } = await useFetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`).get().json();
        return data.value;
    }

    // Fetch single user
    async fetchSingleUser(id: number) {
        const { isFetching, error, data } = await useFetch(`https://jsonplaceholder.typicode.com/users/${id}`).get().json();
        return data.value;
    }

    // Save single post in state
    saveSinglePost(post: Types.PostsState, comments: Types.PostComments[]) {
        this.#singlePost = { post, comments };
    }
}

const store = new PostStore();

export function usePosts() {
    return store;
}
