import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Index.vue";
import Posts from "../views/posts/AllPostsPage.vue"
import SinglePost from "../views/posts/SinglePostPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/posts",
      name: "posts",
      component: Posts
    },
    {
      path: "/posts/:id",
      name: "single",
      component: SinglePost
    },
  ],
});

export default router;
