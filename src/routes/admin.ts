import AdminLayout from "../layouts/AdminLayout.vue";

export default [
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            { path: '', redirect: { name: 'admin-dashboard' } },
            { path: 'dashboard', name: 'admin-dashboard', component: () => import('../pages/admin/page.vue') },
            { path: 'books', name: 'admin-books', component: () => import('../pages/admin/Books.vue') },
            { path: 'challenges', name: 'admin-challenges', component: () => import('../pages/admin/Challenges.vue') },
            { path: 'users', name: 'admin-users', component: () => import('../pages/admin/Users.vue') },
            { path: 'notifications', name: 'admin-notifications', component: () => import('../pages/admin/Notifications.vue') },
            { path: 'comments', name: 'admin-comments', component: () => import('../pages/admin/Comments.vue') },
            { path: 'reports', name: 'admin-reports', component: () => import('../pages/admin/Reports.vue') },
            { path: 'settings', name: 'admin-settings', component: () => import('../pages/admin/Settings.vue') },
            { path: 'profile', name: 'admin-profile', component: () => import('../pages/admin/Profile.vue') },
            { path: 'analytics', name: 'admin-analytics', component: () => import('../pages/admin/Analytics.vue') },
        ]
    }
]