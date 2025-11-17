import {getChildrens} from '@/router/common'


export default function (obj = {}) {

    const children = getChildrens();

    return [
        {
            path: 'main',
            redirect: "/main/dash",
            component: () => import('@/layouts/tab-layout.vue'),
            children: children.主页.default(obj)
        }
    ]
}