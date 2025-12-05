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
            path: 'task',
            meta: Object.assign({
                role: false,
                icon: 'notes-o',
                name: "任务",
                cache_2: 'task'
            }, obj),
            component: () => import('@/pages/main/task')
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
                name: "工作台",
                cache_2: 'chart'
            }, obj),
            component: () => import('@/pages/main/chart')
        },
    ]
}