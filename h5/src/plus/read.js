/* eslint-disable */
/*
* 通话记录和联系人读取模块
* @author 友人a丶
* @date 2022-07-11
* 
* 功能说明：
* - 读取Android系统的通话记录数据库
* - 获取联系人信息
* - 支持按条件筛选通话记录
* */

import dayjs from "dayjs";


/**
 * 读取设备联系人信息
 * 使用HTML5Plus API获取手机通讯录中的联系人数据
 * @returns {Promise} 返回联系人列表的Promise对象
 */
export function contact() {
    return new Promise((resolve) => {
        /* 获取手机通讯录地址簿 */
        plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
            /* 查找联系人，获取显示名称和电话号码 */
            addressbook.find(["displayName", "phoneNumbers"], function (contacts) {
                /* 返回联系人列表 */
                resolve(contacts)
            }, function () {
                /* 读取失败时返回错误信息 */
                resolve("读取失败")
            }, {multiple: true}); /* 允许返回多个联系人 */
        }, function (e) {
            /* 获取地址簿失败时返回错误信息 */
            resolve(JSON.stringify(e))
        });
    })
}

/* Android通话记录相关类和变量声明 */
let CallLog; /* Android通话记录类 */
let main; /* Android主Activity实例 */
let obj; /* ContentResolver内容解析器 */
let Uri; /* Android URI类 */
let uris; /* 通话记录数据库URI */
let loaded; /* 标记是否已初始化 */


/**
 * 读取Android系统通话记录
 * 根据指定条件查询通话记录数据库，支持多种筛选条件
 * @param {Object} condition - 查询条件对象
 * @returns {Array} 返回符合条件的通话记录数组
 */
export function record(condition = {
    mobile: null,
    callTime: null,
    endTime: null,
    type: null
}) {

    /* 初始化Android相关类（避免重复初始化） */
    if (!loaded) {
        /* 导入Android通话记录类 */
        CallLog = plus.android.importClass("android.provider.CallLog");
        /* 获取当前应用的主Activity */
        main = plus.android.runtimeMainActivity();
        /* 获取内容解析器，用于查询系统数据库 */
        obj = main.getContentResolver();
        /* 导入Android URI类 */
        Uri = plus.android.importClass("android.net.Uri");
        /* 解析通话记录数据库的URI */
        uris = Uri.parse("content://call_log/calls");
        /* 导入内容解析器类 */
        plus.android.importClass(obj);
        /* 标记已初始化 */
        loaded = true;
    }


    /* 用于存储查询结果的数组 */
    const records = [];

    /* 记录总数统计 */
    const total = {count: 1};

    /*
    * 解析单条通话记录数据
    * @param {Cursor} cursor - 数据库游标对象
    * */
    const read = function (cursor) {

        /* 创建单条记录对象 */
        const record = Object.create(null);

        /* 获取电话号码 */
        record.phone = cursor.getString(cursor.getColumnIndex(CallLog.Calls.NUMBER));

        /* 获取通话类型 */
        record.type = cursor.getString(cursor.getColumnIndex(CallLog.Calls.TYPE));

        /* 根据通话类型码转换为可读文本 */
        switch (parseInt(record.type)) {
            case CallLog.Calls.INCOMING_TYPE:
                /* 来电 */
                record.desc = "呼入";
                break;
            case CallLog.Calls.OUTGOING_TYPE:
                /* 去电 */
                record.desc = "呼出";
                break;
            case CallLog.Calls.MISSED_TYPE:
                /* 未接来电 */
                record.desc = "未接";
                break;
            case 5:
                /* 拒接来电 */
                record.desc = "拒接";
                break;
            default:
                /* 其他情况（如挂断） */
                record.desc = "挂断";
                break;
        }

        /* 获取通话开始时间并格式化 */
        record.call_time = dayjs(new Date(parseInt(cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE))))).format("YYYY-MM-DD HH:mm:ss");
        /* 获取号码归属地信息 */
        record.place = cursor.getString(cursor.getColumnIndex(CallLog.Calls.GEOCODED_LOCATION));
        /* 获取通话时长（秒） */
        record.duration = parseInt(cursor.getString(cursor.getColumnIndex(CallLog.Calls.DURATION)));

        /* 将记录添加到结果数组 */
        records.push(record);
        total.count++;

    }

    /* 构建SQL查询条件数组 */
    const query_condition = [];

    /* 根据手机号码筛选（支持模糊匹配）*/
    if (!!condition.mobile) {
        query_condition.push(`${CallLog.Calls.NUMBER} like '%${condition.mobile}%'`)
    }

    /* 根据通话开始时间筛选（大于等于指定时间） */
    if (!!condition.callTime) {
        query_condition.push(`${CallLog.Calls.DATE} >= ${condition.callTime}`)
    }

    /* 根据通话结束时间筛选（小于等于指定时间） */
    if (!!condition.endTime) {
        query_condition.push(`${CallLog.Calls.DATE} <= ${condition.endTime}`)
    }

    /* 根据通话类型筛选（精确匹配） */
    if (!!condition.type) {
        query_condition.push(`${CallLog.Calls.TYPE} = ${condition.type}`)
    }


    /**
     * 执行数据库查询操作
     *
     * ContentResolver.query()方法参数说明：
     * - uri: 查询的数据源URI，这里是通话记录数据库
     * - projection: 要查询的列名数组，null表示查询所有列
     * - selection: WHERE子句条件，用于筛选数据
     * - selectionArgs: selection中占位符的参数值，这里不使用占位符所以为null
     * - sortOrder: 排序规则，null表示使用默认排序
     **/
    const cursor = obj.query(
        uris, /* 通话记录数据库URI */
        null, /* 查询所有列 */
        query_condition.length ? query_condition.join(" and ") : null, /* 组合查询条件 */
        null, /* 不使用参数占位符 */
        null /* 使用默认排序 */
    );


    /* 导入Cursor类以便在JavaScript中使用 */
    plus.android.importClass(cursor);

    /**
     * 遍历查询结果
     *
     * Cursor对象常用方法说明：
     * - moveToFirst(): 移动到第一条记录
     * - moveToNext(): 移动到下一条记录
     * - getColumnIndex(): 获取指定列的索引
     * - getString(): 获取指定列的字符串值
     * - getInt(): 获取指定列的整数值
     * - close(): 关闭游标释放资源
     **/

    /* 检查是否有查询结果并移动到第一条记录 */
    if (cursor.moveToFirst()) {
        /* 读取第一条通话记录 */
        read(cursor);
        /* 循环读取剩余的通话记录 */
        while (cursor.moveToNext()) {
            read(cursor);
        }
    }

    /* 返回所有查询到的通话记录 */
    return records;

}


export default {
    contact,
    record
}