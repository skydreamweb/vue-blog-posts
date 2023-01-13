namespace Types {
    export interface Post {
        body: string;
        id: number;
        title: string;
        userId: number;
        userName: string;
    };

    export interface User {
        id: number;
        name: string;
        email: string;
        body: string;
        username: string;
    }

    export interface PostComments {
        postId: number,
        id: number;
        name: string;
        email: string;
        body: string;
    }

    export interface PostsState {
        body: string;
        id: number | null;
        title: string;
        userId: number | null;
        userName?: string;
        userEmail?: string;
    }

    export interface SinglePostState {
        post: PostsState;
        comments: PostComments[];
    }

    export interface UsersState {
        id: number;
        name: string;
        email: string;
    }

    export interface PostsStateItems extends Array<PostsState> { }

}


export default Types