import UserLayout from "../layouts/UserLayout.vue";
import Home from "../pages/user/Home.vue";
import LandingPage from "../pages/user/landingPage.vue";
import WritingPage from "../pages/user/WritingPage.vue";

export default [
    {
        path: '/user',
        component: UserLayout,
        children: [
            { path: '/', name: 'landingpage', component: LandingPage },
            { path: '/home', name: 'homepage', component: Home },
            { path: '/community', name: 'community', component: () => import('../pages/user/Community.vue') },
        ]
    },
    {
        path: '/:id/write',
        name: 'writingpage',
        component: WritingPage
    },
    {
        path: '/reading/:id',
        name: 'readingpage',
        component: () => import('../pages/user/Reader.vue')
    }
]