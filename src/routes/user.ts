import UserLayout from "../layouts/UserLayout.vue";
import Home from "../pages/user/Home.vue";
import LandingPage from "../pages/user/landingPage.vue";

export default [
    {
        path: '/user',
        component: UserLayout,
        children: [
            { path: '/', name: 'landingpage', component: LandingPage },
            { path: '/home', name: 'homepage', component: Home },
            { path: '/community', name: 'community', component: () => import('../pages/user/Community.vue') },
        ]
    }
]