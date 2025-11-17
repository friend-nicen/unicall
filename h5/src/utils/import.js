/*
* @author 友人a丶
* @date 2022-07-11
* @app Vue应用对象
* 批量导入指定文件夹内的所有组件
* */

export default function (app) {

    /**
     * 指定要导入的文件目录
     * 直接加载用globEager,懒加载用glob
     **/
    const modules = import.meta.glob([
        '@/layouts/*.vue',
        '@/layouts/*/*.vue',
        '@/components/*.vue',
        '@/components/*/*.vue'
    ], {eager: true});

    /* 批量引入组件 */
    for (let i in modules) {
        const name = /(.*)?\/(.*).vue/.exec(i);
        app.component(name[2], modules[i].default);
    }

}