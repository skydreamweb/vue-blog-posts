namespace Types {
    export interface Post {
        id: number;
        title: string;
        body: string;
        userId: number;
        userName?: string;
        userEmail?: string;
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

    export interface SinglePostState {
        post: Post;
        comments: PostComments[];
    }

    export interface UsersState {
        id: number;
        name: string;
        email: string;
    }

    export interface PostsStateItems extends Array<Post> { }

}


export default Types