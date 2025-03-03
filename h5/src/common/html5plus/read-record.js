/* eslint-disable */
/*
* @author 友人a丶
* @date 2022-07-11
* 读取通话记录
* */

import dayjs from "dayjs";
import {sleep} from "@/common/usual/common";


// 在这里调用plus api
let CallLog;
let main;
let obj;
let Uri;
let uris;
let loaded;


/**
 * 获取指定时间之后的所有通话记录
 * @param condition 查询条件
 * @returns {Promise<unknown>}
 */
export default function (condition = {mobile: null, callTime: null, endTime: null, type: null,}) {

    /* 内容是否已经初始化 */
    if (!loaded) {
        CallLog = plus.android.importClass("android.provider.CallLog");
        main = plus.android.runtimeMainActivity();
        obj = main.getContentResolver();
        Uri = plus.android.importClass("android.net.Uri");
        uris = Uri.parse("content://call_log/calls");
        plus.android.importClass(obj);
        loaded = true; //标记已加载
    }


    const records = []; // 用来存储数据
    const total = {count: 1}; // 记录总数


    /*
    * 读取通话记录
    * */
    const read = function (cursor) {

        const record = Object.create(null); //单条记录对象

        record.number = cursor.getString(cursor.getColumnIndex(CallLog.Calls.NUMBER));
        record.type = cursor.getString(cursor.getColumnIndex(CallLog.Calls.TYPE));

        switch (parseInt(record.type)) // 判断通话类型
        {
            case CallLog.Calls.INCOMING_TYPE:
                record.typeText = "呼入";
                break;
            case CallLog.Calls.OUTGOING_TYPE:
                record.typeText = "呼出";
                break;
            case CallLog.Calls.MISSED_TYPE:
                record.typeText = "未接";
                break;
            case 5:
                record.typeText = "拒接";
                break;
            default:
                record.typeText = "挂断";
                break;
        }

        /* 通话开始时间 */
        record.callTime = dayjs(new Date(parseInt(cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE))))).format("YYYY-MM-DD HH:mm:ss");
        /* 联系人 */
        record.contact = cursor.getString(cursor.getColumnIndex(CallLog.Calls.CACHED_NAME));
        /* 归属地 */
        record.location = cursor.getString(cursor.getColumnIndex(CallLog.Calls.GEOCODED_LOCATION));
        /* 通话时长 */
        record.duration = parseInt(cursor.getString(cursor.getColumnIndex(CallLog.Calls.DURATION)));

        /* 数据+++ */
        records.push(record);
        total.count++;

    }


    /* 查询条件 */
    const query_condition = [];

    /*
    * 传递了手机号
    * */
    if (!!condition.mobile) {
        query_condition.push(`${CallLog.Calls.NUMBER} like '%${condition.mobile}%'`)
    }

    /*
    * 传递了拨号时间
    * */
    if (!!condition.callTime) {
        query_condition.push(`${CallLog.Calls.DATE} >= ${condition.callTime}`)
    }

    /*
    * 传递了结束时间
    * */
    if (!!condition.endTime) {
        query_condition.push(`${CallLog.Calls.DATE} <= ${condition.endTime}`)
    }

    /*
    * 传递了结束时间
    * */
    if (!!condition.type) {
        query_condition.push(`${CallLog.Calls.TYPE} = ${condition.type}`)
    }


    /*
        cursor = contentResolver.query(Uri.parse("content://phone/calls"), null, null, null, null);
        cursor 是一个 Cursor 对象，它用于处理查询结果。
        在上面的代码中，contentResolver.query() 方法用于查询 Android 设备上的通话记录数据库，Uri.parse("content://phone/calls") 用于指定查询的 URI，
        其中 content://phone/calls 表示通话记录数据库的 URI。
        null 作为 queryParameters 的值表示不限制查询结果的数量，也不设置任何过滤条件。
        null 作为 PROJECTION 的值表示不查询任何字段。
        null 作为 SORT_ORDER 的值表示不设置排序条件。
        null 作为 LIMIT 的值表示不限制查询结果的数量。
    * */
    const cursor = obj.query(
        uris,
        null,
        query_condition.length === 0 ? null : query_condition.join("and"),   //传入条件
        null,
        null
    );


    /* 动态引入这个游标 */
    plus.android.importClass(cursor);


    /*
        Cursor 对象提供了许多方法，用于处理查询结果。以下是 Cursor 对象的一些常用方法:

        moveToFirst():将 Cursor 移动到第一条记录。
        moveToNext():将 Cursor 移动到下一条记录。
        moveToLast():将 Cursor 移动到最后一条记录。
        moveToPosition(int position):将 Cursor 移动到指定的位置。
        getColumnIndex(String columnName):返回 Cursor 中指定列的索引。
        getString(int columnIndex):返回 Cursor 中指定列的字符串值。
        getInt(int columnIndex):返回 Cursor 中指定列的整数值。
        getLong(int columnIndex):返回 Cursor 中指定列的长整数值。
        query():用于重新查询 Cursor 中的所有列。
        toString():将 Cursor 转换为字符串表示。
        close():关闭 Cursor 对象，释放资源。
        getCount():返回 Cursor 中记录的数量。
        isNull(int columnIndex):检查 Cursor 中指定列的值是否为 null。
        isAfterLast():检查 Cursor 是否已经移动到最后一条记录之后。
        isBeforeFirst():检查 Cursor 是否已经移动到第一条记录之前。
        isLast():检查 Cursor 是否已经移动到最后一条记录。
        isFirst():检查 Cursor 是否已经移动到第一条记录。
        next():移动 Cursor 到下一条记录，并返回 true。
        prev():移动 Cursor 到上一条记录，并返回 true。
        first():将 Cursor 移动到第一条记录，并返回 true。
        last():将 Cursor 移动到最后一条记录，并返回 true。
        valid():检查 Cursor 是否有效，即是否已经移动到正确的位置。
        这些方法可以让您更轻松地处理 Cursor 对象，并简化查询操作。例如，您可以使用 moveToFirst() 方法将 Cursor 移动到第一条记录，然后使用 next() 方法逐行处理查询结果。
    * */

    if (cursor.moveToFirst()) {

        /*
        * 读取第一条数据
        * */
        read(cursor);
        /*
        * 循环读取，如果有下一条数据
        * */
        while (cursor.moveToNext()) {
            read(cursor);
        }
    }

    return records;

}