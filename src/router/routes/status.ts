export default {
    path: '/status',
    component: () => import('@/pages/StatusView.vue'),
    meta: {
        tab: 'status',
        title: '状态'
    }
}
