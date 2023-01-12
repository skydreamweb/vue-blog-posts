import { reactive, readonly, ref } from "vue";

interface PostsState {
    body: string;
    id: number | null;
    title: string;
    userId: number | null;
}

interface PostsStateItems extends Array<PostsState> { }

export class PostStore {
    #allPosts;   // Private variable #allPosts keeps total number of posts

    constructor() {
        this.#allPosts = reactive<PostsStateItems>([]);
    }

    getState() {
        return readonly(this.#allPosts);
    }

    async fetchAllPosts() {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        this.#allPosts.splice(0, this.#allPosts.length, ...data);
    }
}

const store = new PostStore();

export function usePosts() {
    return store;
}
