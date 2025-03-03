/*
* 一些公共的方法
* */


/*
* 获取两个日期的所有中间日期
*
* start,end ,dayjs对象
* */
import dayjs, {isDayjs} from "dayjs";
import {cloneDeep} from "lodash";
import {reactive, isRef} from "vue";


/**
 * 获取指定时间范围内的日期
 * @param start
 * @param end
 * @param format
 * @returns {*[]}
 */
export function getDays(start, end, format = "YYYY-MM-DD") {

    let days = [];
    let temp = start; //中间日期

    /*start大于等于end*/
    if (start.isAfter(end)) {
        return days;
    }

    /*相同那就是一天*/
    if (start.isSame(end)) {
        days.push(temp.format(format)); //默认第一天
    }

    /*遍历所有中间日期*/
    // eslint-disable-next-line
    while (1) {


        temp = temp.add(1, 'day'); //加1

        if (temp.isAfter(end)) {
            break;
        }

        days.push(temp.format(format));

    }


    return days;
}


/**
 * 延迟执行
 * @param callback
 * @param time
 */
export function delay(callback, time) {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        callback();
    }, time);
}


/**
 * 禁止选择的时间范围
 * @param datetime
 * @returns {boolean}
 */
export function disabledDate(datetime) {
    let today = dayjs(); //当天的时间
    if (today.isAfter(dayjs(datetime))) {
        return false;
    } else {
        return true;
    }
}


/**
 * 返回表格行key值
 * @param record
 * @returns {*}
 */
export function key(record, key = "id") {
    return record[key];
}


/**
 * 获取上传文件的图片base64
 * @param file
 * @returns {Promise<unknown>}
 */
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/**
 * 获取间隔某个日期的天数
 * @param day
 * @returns {number}
 */
export function diff(day) {

    let now = dayjs().format("DD");

    if (parseInt(now) > parseInt(day)) {
        let predix = dayjs(dayjs().format("YYYY-MM-") + (parseInt(day) > 10 ? day : "0" + day)).add(1, "month");
        return predix.diff(dayjs(), 'day');
    } else {
        return parseInt(day) - parseInt(now);
    }
}


/*
* 条件转换
* */
export function switchForm() {

    let data = Object.create(null); //数据对象

    /* 拼合数据 */
    for (let i of arguments) {
        data = Object.assign(data, i);
    }


    //参数检测
    if (!data) {
        console.warn("无效参数");
        return {};
    }

    try {
        let condition;

        if (isRef(data)) {
            condition = cloneDeep(data.value);
        } else {
            condition = cloneDeep(data);
        }


        /*
        * 转换所有dayjs
        * */
        for (let i in condition) {

            if (condition[i] === "" || condition[i] === null || condition[i] === undefined) {
                delete condition[i];
                continue;
            }

            if (isDayjs(condition[i])) {
                condition[i] = condition[i].format("YYYY-MM-DD");
                continue;
            }

            if (isRef(condition[i])) {
                condition[i] = condition[i].value;
            }

            if (condition[i] instanceof Array) {

                if (condition[i].length == 0) {
                    delete condition[i];
                    continue;
                }

                let count = 0; //有效数据量

                condition[i] = condition[i].map(item => {
                    if (isDayjs(item)) {
                        item = item.format("YYYY-MM-DD");
                    }
                    if (item !== null) {
                        count++;
                    }
                    return item
                })

                if (count == 0) {
                    delete condition[i];
                }


                continue;
            }
        }


        return condition;
    } catch (e) {
        console.warn(e)
    }


}


/**
 * 数据容器，并提供重置的方法
 * @param ref
 * @returns {{data: *, reset: reset}}
 */
export function store(res) {

    let init = reactive({
        primary: cloneDeep(res),
        data: cloneDeep(res),
        /*
        * 重置回上一个快照
        * */
        reset: () => {
            init.data = Object.assign(init.data, init.primary);
            return true;
        },
        /*
        * 替换
        * */
        $set(set) {
            init.data = Object.assign(init.data, set);
            return true;
        },
        /*
        * 保存快照
        * */
        save: (snap) => {
            init.primary = cloneDeep(snap);
            return true;
        }
    })

    return init;
}


/**
 * 下拉数据搜索
 * @param input
 * @param option
 * @returns {boolean}
 */
export function filterOptions(input, option) {
    return option.label.indexOf(input) > -1;
}


/**
 * @param arr
 * @returns {*}
 * 获取数组最后一个元素
 */
export function pop(arr) {
    if (arr.length == 0) {
        return null;
    }
    return arr[arr.length - 1];
}

/**
 * 休眠函数
 * @param sec
 * @return {*}
 */
export function sleep(sec) {
    return new Promise(resolve => {
        //sleep
        let timer = setTimeout(() => {
            clearTimeout(timer)
            resolve(sec)
        }, Math.floor(sec))
    })
}