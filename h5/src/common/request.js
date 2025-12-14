import {computed, ref} from "vue";
import load from "@/common/load";
import {store} from "@/common";
import axios from "axios";


/**
 * 分页请求
 * @param config
 */
const page = (config) => {

    /* 默认值 */
    config = Object.assign({
        data: {},
        method: "POST",
        /* 是否显示加载效果 */
        showLoading: true,
        /* 请求前的回调 */
        before: null,
        /* 过滤处理响应数据 */
        filter: (res) => res,
        /* 请求完成 */
        complete: (res) => res,
        /* 请求异常 */
        error: (res) => res
    }, config);

    const {
        method,
        showLoading,
        before,
        /** @type Function */
        filter,
        /** @type Function */
        complete,
        /** @type Function */
        error
    } = config;


    /* 状态 */
    const data = ref([]);
    const loaded = ref(false);
    const loading = ref(false);

    /* 分页 */
    const paginate = store({
        total: 1,
        current: 0
    });

    /* 已加载完所有数据 */
    const finish = computed(() => {
        return !loading.value && paginate.data.total <= paginate.data.current;
    });


    /**
     * 请求数据
     * @return {Promise<void>}
     */
    const loadData = async () => {

        if (finish.value) return;
        if (before && !before({paginate, finish, loaded})) return;

        try {

            if (typeof showLoading === 'boolean' ? showLoading : showLoading()) load.loading("加载中...");

            loading.value = true;
            paginate.data.current++;

            return axios.request({
                method,
                url: typeof config.url === 'string' ? config.url : config.url(),
                data: {
                    ...(typeof config.data === 'object' ? config.data : config.data()),
                    page: paginate.data.current,
                },
            }).then(res => {

                if (res.data.code) {

                    const processedRes = filter(res);

                    const newData = processedRes.data.data.data || [];

                    if (paginate.data.current === 1) {
                        data.value = newData;
                    } else {
                        data.value = data.value.concat(newData);
                    }

                    paginate.data.total = processedRes.data.data.last_page || 1;

                    complete({
                        res: processedRes,
                        finish,
                        loaded
                    });

                    if (!loaded.value) loaded.value = true;


                } else {
                    load.error(res.data.errMsg);
                    error(res);
                }

            }).catch((e) => {
                console.log(e);
                load.error(e.message);
            }).finally(() => {
                loading.value = false;
                if (typeof showLoading === 'boolean' ? showLoading : showLoading()) load.loaded();
            })

        } catch (error) {
            console.error("加载数据失败:", error);
            load.error("加载数据失败");
        }
    };


    return {
        data,
        paginate,
        finish,
        loading,
        loaded,
        loadData,
    };
}

/**
 * 普通请求，获取json数据
 * @param config
 */
const json = (config) => {

    /* 默认值 */
    config = Object.assign({
        data: {},
        method: "POST",
        /* 是否显示加载效果 */
        showLoading: true,
        /* 请求前的回调 */
        before: null,
        /* 过滤处理响应数据 */
        filter: (res) => res,
        /* 请求完成 */
        complete: (res) => res,
        /* 请求异常 */
        error: (res) => res
    }, config);

    const {
        method,
        showLoading,
        before,
        /** @type Function */
        filter,
        /** @type Function */
        complete,
        /** @type Function */
        error
    } = config;


    /* 状态 */
    const data = ref([]);
    const loaded = ref(false);
    const loading = ref(false);

    /**
     * 请求数据
     * @return {Promise<void>}
     */
    const loadData = async () => {

        if (before && !before({loaded})) return;

        try {

            if (typeof showLoading === 'boolean' ? showLoading : showLoading()) load.loading("加载中...");

            loading.value = true;

            return axios.request({
                method,
                url: typeof config.url === 'string' ? config.url : config.url(),
                data: {
                    ...(typeof config.data === 'object' ? config.data : config.data()),
                },
            }).then(res => {
                if (res.data.code) {

                    const processedRes = filter(res);
                    data.value = processedRes.data.data || [];

                    complete({
                        res: processedRes,
                        loaded
                    });

                    if (!loaded.value) loaded.value = true;

                } else {
                    load.error(res.data.errMsg);
                    error(res);
                }

            }).catch((e) => {
                console.log(e);
                load.error(e.message);
            }).finally(() => {
                loading.value = false;
                if (typeof showLoading === 'boolean' ? showLoading : showLoading()) load.loaded();
            })
        } catch (error) {
            console.error("加载数据失败:", error);
            load.error("加载数据失败");
        }
    };

    return {
        data,
        loading,
        loaded,
        loadData
    };
}


/**
 * @param config
 */
export default function (config) {
    /* 默认值 */
    config = Object.assign({type: 1}, config);
    if (config.type === 1) {
        return page.call(this, config);
    } else {
        return json.call(this, config);
    }
}