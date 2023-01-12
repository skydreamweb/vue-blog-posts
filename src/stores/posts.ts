import { reactive, readonly, ref } from "vue";

interface PostsState {
    body: string;
    id: number | null;
    title: string;
    userId: number | null;
    userName?: string;
    userEmail?: string;
}

interface UsersState {
    id: number;
    name: string;
    email: string;
}

interface PostComments {
    postId: number,
    id: number;
    name: string;
    email: string;
    body: string;
}

interface PostsStateItems extends Array<PostsState> { }
interface SinglePostState {
    post: PostsState;
    comments: PostComments[];
}

export class PostStore {
    #allPosts;                // Private variable #allPosts keeps total number of posts
    #chunk: PostsStateItems;  // Private variable #chunk keeps last 10 updated posts
    #singlePost: SinglePostState; // Private variable #comments keeps all the comments from the single post

    constructor() {
        this.#chunk = reactive<PostsStateItems>([]);
        this.#allPosts = ref(0);
        this.#singlePost = reactive<SinglePostState>({
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
        const fetchedPostData = await fetchChunkOfPosts.json() as PostsStateItems

        // Fetch all users
        const fetchAllUsers = await fetch(`https://jsonplaceholder.typicode.com/users`);
        const fetchedUserData = await fetchAllUsers.json() as UsersState[]

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
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        this.#allPosts = data;
    }

    // Fetch single post
    async fetchSinglePost(id: number) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const data = await res.json();
        return data;
    }

    // Fetch single post comments
    async fetchSinglePostComments(id: number) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
        const data = await res.json();
        return data;
    }

    // Fetch single user
    async fetchSingleUser(id: number) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        const data = await res.json();
        return data;
    }

    // Save single post in state
    saveSinglePost(post: PostsState, comments: PostComments[]) {
        this.#singlePost = { post, comments };
    }
}

const store = new PostStore();

export function usePosts() {
    return store;
}
