import UserLayout from "../layouts/UserLayout.vue";
import Home from "../pages/user/Home.vue";
import LandingPage from "../pages/user/landingPage.vue";
import BookDetail from "../pages/user/BookDetail.vue";

export default [
    {
        path: '/user',
        component: UserLayout,
        children: [
            { path: '/', name: 'landingpage', component: LandingPage },
            { path: '/home', name: 'homepage', component: Home },
            { path: '/community', name: 'community', component: () => import('../pages/user/Community.vue') },
            { path: '/book-detail', name: 'book-detail', component: BookDetail },
        ]
    }
]