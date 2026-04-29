import AdminLayout from "../layouts/AdminLayout.vue";

export default [
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            { path: 'dashboard', name: 'admin-dashboard', component: () => import('../pages/admin/page.vue') },
        ]
    }
]