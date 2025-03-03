/*
* @author 友人a丶
* @date 2022-08-12
*
* 读取短信
* @reference,https://blog.csdn.net/lyshark_lyshark/article/details/125848613
*
* content://sms/          所有短信
* content://sms/inbox     收件箱
* content://sms/sent      已发送
* content://sms/draft     草稿
* content://sms/outbox    发件箱
* content://sms/failed    发送失败
* content://sms/queued    待发送列表
* */

import dayjs from "dayjs";

export default function () {

    var main = plus.android.runtimeMainActivity();
    var Uri = plus.android.importClass("android.net.Uri");
    var ContactsContract = plus.android.importClass('android.provider.ContactsContract');
    var uri = Uri.parse("content://sms/");
    var cr = main.getContentResolver();
    plus.android.importClass(cr);
    var cur = cr.query(uri, null, `date >= ${dayjs('2022-07-01').toDate().getTime()}`, null, null);
    plus.android.importClass(cur);

    cur.moveToFirst();

    var index_Body = cur.getColumnIndex("body");
    var body = cur.getString(index_Body);

    //console.log(index_Body, body);

    let count = 0;
    count++;

    while (cur.moveToNext()) {
        var index_Address = cur.getColumnIndex("address");
        var address = cur.getString(index_Address);
        //短信内容
        var index_Body = cur.getColumnIndex("body");
        var body = cur.getString(index_Body);
        //类型1接收 2发送
        var index_Type = cur.getColumnIndex("type");
        var type = cur.getString(index_Type);
        count++;
        //console.log(address, body, type);
    }

    //console.log(count)
}