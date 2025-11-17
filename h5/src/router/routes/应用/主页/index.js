export default function (obj = {}) {
    return [
        {
            path: 'contact',
            meta: Object.assign({
                role: false,
                icon: "friends-o",
                name: "通讯录",
                cache_2: 'contact'
            }, obj),
            component: () => import('@/pages/main/contact')
        },
        {
            path: 'dial',
            meta: Object.assign({
                role: false,
                icon: "service-o",
                name: "通话记录",
                cache_2: 'dial'
            }, obj),
            component: () => import('@/pages/main/dial')
        },
        {
            path: 'chart',
            meta: Object.assign({
                role: false,
                icon: 'bar-chart-o',
                name: "统计",
                cache_2: 'chart'
            }, obj),
            component: () => import('@/pages/main/chart')
        },
        {
            path: 'user',
            meta: Object.assign({
                role: false,
                icon: "manager-o",
                name: "我的",
                cache_2: 'user'
            }, obj),
            component: () => import('@/pages/main/user')
        }
    ]
}