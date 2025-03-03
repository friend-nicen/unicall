/*
* 操作路由的相关方法
* */
import {router} from "@/router";
import user from "@/stores/user";


/*
* 获取某个路由项的下面的子路由
* getRoutes之后的路由路径是完整路由
* children子路由是定义时的路径
* 所以需要转换
* 同时会递归，将所有子路由的path拼接成完整的路径
* 主要用于生成菜单，如果定义了NotMenu元属性或者是动态路由  该路由将被忽略
* 顶部菜单栏通过这个方法获取下级菜单
* 最终返回的 子路由数组
* */
export function getChildren(path) {

    /*
    * path是一个完整的路由路径
    * */
    const routes = router.getRoutes();//得到的一个可以随意修改的不影响router 的数组
    const users = user();  /*用户信息*/
    let children = [];//

    /*
    * 对比路由
    * 判断是否具有子路由
    * */
    for (let i of routes) {
        if (i.path == path) {
            if (!!i.children) {
                children = i.children;
            }
        }
    }


    /*
    * 拼接完整的子路由path访问路径
    * */
    children = children.filter((i) => {

        /*
        * 判断是否作为菜单
        * 判断是否是动态路由
        * 判断权限是否够
        * */
        if (i.meta && ((i.meta.menu === false) || (i.path.indexOf(":") >= 0) || (users.basic.role < i.meta.role))) {
            return false;
        } else {
            return true;
        }

    }).map((i) => {

        /*
        * 获取路由的完整路径
        * */
        //如果本身就是绝对路径
        if (!i.path.startsWith('/')) {
            //如果是相对路径
            if (path == '/') {
                i.path = path + i.path;
            } else {
                i.path = path + '/' + i.path;
            }
        }

        /*
        *
        * 根据完整路径递归子路由
        * */
        if (!!i.children) {
            i.children = getChildren(i.path);
        }

        return i;
    })

    return children;
}


/*
* 批量导入子路由
* */

export function getChildrens() {


    /*批量导入子路由*/
    const modules = import.meta.glob(['@/router/*/index.js', '@/router/*/*/index.js', '@/router/*/*/*/index.js', '@/router/*/*/*/*/index.js'], {eager: true});
    const AutoRoutes = Object.create(null);//空对象；

    for (let i in modules) {
        let name = /([^/]*)?\/index.js/.exec(i);
        AutoRoutes[name[1]] = modules[i];
    }

    return AutoRoutes;

}

