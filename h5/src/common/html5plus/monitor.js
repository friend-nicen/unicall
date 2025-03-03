import api from "@/service/api";
import axios from "axios";
import getRecord from "./read-record";
import {sleep} from "@/common/usual/common";
import dayjs from "dayjs";
import user from "@/stores/user";
import load from "@/common/usual/load";

/*
* uniapp android11 不支持plus api读取应用目录 以外的其他系统文件目录
* 需要通过native.js 调用java去读取
* 通过native调用java去读取时 FileinputStream读取的速度会特别慢，并且只能循环read()读取。
*
* 并且js的数据类型无法正常存储读取出来的数据
* 也无法转换为html文件上传需要的blob对象
*
* 本示例通过文件流的Channel拷贝文件到应用可以读取的目录
* 然后通过调用htmlplus的api上传文件，最终实现通话录音文件读取
* */


/*
* 引入java类包
* */
let environment,
    File,
    Context,
    FileInputStream,
    FileOutputStream,
    sdRoot,
    appFile,
    teleManager,
    ActivityManager,
    rooe_path,
    loaded; //设备保存路由的目录


/*
* 记录运行时的毫秒时间
* */
function log_time($step) {
    console.log($step, dayjs().format('YYYY-MM-DD HH:mm:ss:SSS'));
}


/*
* 初始化加载资源
* */
function construct() {


    if (!loaded) {

        /*
        * 初始化类包
        * */
        environment = plus.android.importClass("android.os.Environment");
        File = plus.android.importClass("java.io.File");
        Context = plus.android.importClass("android.content.Context");
        FileInputStream = plus.android.importClass("java.io.FileInputStream");
        FileOutputStream = plus.android.importClass("java.io.FileOutputStream");

        /*
        * 只需要引入
        * */
        plus.android.importClass("android.telephony.TelephonyManager");
        plus.android.importClass('java.nio.channels.FileChannel');
        plus.android.importClass("android.telephony.TelephonyManager");
        plus.android.importClass("android.app.ActivityManager");//活动示例对象管理


        /*
        * 应用目录
        * */
        sdRoot = environment.getExternalStorageDirectory(); //文件夹根目录
        appFile = plus.android.runtimeMainActivity().getApplicationContext().getFilesDir().getPath(); //应用目录
        teleManager = plus.android.runtimeMainActivity().getSystemService(Context.TELEPHONY_SERVICE);
        ActivityManager = plus.android.runtimeMainActivity().getSystemService(Context.ACTIVITY_SERVICE); //获取activity管理器

        /*
        * 标记资源已加载
        * */
        loaded = true;
        log_time('construct');

    }
}


/*
* 根据机型获取录音存储的目录
* */
export function getRecordPath() {

    construct(); //初始化

    log_time('getRecordPath');

    /*
    * 减少逻辑判断
    * */
    if (rooe_path) {
        return rooe_path;
    }

    let type = plus.device.vendor.toLowerCase();

    let path = "";


    switch (type) {
        case "xiaomi":
            path = '/MIUI/sound_recorder/call_rec/';   //指定文件路径
            break;
        case "huawei":
            path = "/Sounds/CallRecord/";
            break;
        case "honor":
            path = "/Sounds/CallRecord/";
            break;
        case "nova":
            path = "/Sounds/CallRecord/";
            break;
        case "meizu":
            path = "/Recorder";
            break;
        case "oppo":
            path = "/Music/Recordings/Call Recordings";
            break;
        case "vivo":
            path = "/Record/Call";
            break;
        case "samsung":
            path = "/Sounds";
            break;
        default:
            return false;
    }

    rooe_path = sdRoot + path;
    return sdRoot + path;

}


/*
* 目录文件遍历
* 获取指定目录下的文件，并按照创建时间排序
* */
export function readDirs(Dir) {

    construct(); //初始化
    log_time("readDirs");

    let Dirs = new File(Dir);
    let temp = Dirs.listFiles();
    let destination = []; //目标数组


    /*
    * 判断是否存在录音文件
    * */
    if (!temp) {
        return false;
    }

    /*
    * 排除目录
    * */
    temp.forEach(function (item) {
        if (item.isFile()) {
            destination.push({
                filepath: item.getAbsolutePath(),
                datetime: item.lastModified()
            });
        }
    })

    /*
    * 按修改时间排序
    * */
    destination.sort(function (a, b) {
        return b.datetime - a.datetime;
    })

    if (destination.length == 0) {
        return false;
    }

    destination[0].number = destination.length; //记录文件数量
    return destination[0]; //返回最新的文件

}


/*
* 复制文件
* 将应用沙箱目录之外的文件复制到应用沙箱目录
* */
function copy(file) {


    construct(); //初始化


    log_time("copy");


    let reader = new FileInputStream(file);
    let temp = appFile + "/" + (new Date()).getTime() + ".mp3";
    let out = new FileOutputStream(temp);
    let fisChannel = reader.getChannel();
    let fosChannel = out.getChannel();
    //将fisChannel通道的数据，写入到fosChannel通道
    fisChannel.transferTo(0, fisChannel.size(), fosChannel);
    reader.close();
    out.close();

    return temp;
}

/*
* 上传文件
* */
function upload(filePath, param) {


    construct(); //初始化

    log_time("upload");

    const userInfo = user(); //用户信息

    return new Promise((resolve => {

        const task = plus.uploader.createUpload(
            api.receiver,
            {
                method: "POST",
                priority: 100
            },
            (ob, status) => {

                /*删除临时文件*/
                deleteFile(filePath);

                //console.log(ob)

                resolve({
                    ob,
                    code: status
                });
            }
        );

        /* 添加待上传的文件 */
        task.addFile("file://" + filePath, {key: "file"});
        task.addData("json", JSON.stringify(param));

        /* 权限认证 */
        task.setRequestHeader("Authorization", userInfo.basic.token);

        task.start(); //开始上传
        log_time("upload end");

    }))

}


/*
* 上传文件
* */
function notice(param) {


    construct(); //初始化

    log_time("notice");

    return new Promise((resolve => {

        let post = JSON.stringify(param)

        axios.post(api.receiver, "json=" + post, {
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then(() => {
            resolve({
                code: 200,
                errMsg: "提交成功。"
            });
        }).catch((e) => {
            resolve({
                code: 0,
                errMsg: e.message
            });
        })

    }))

}


/*
* 删除指定目录的文件
* */
function deleteFile(file) {

    construct(); //初始化

    console.log(file);
    log_time("deleteFile");

    if (!file) return;

    let files = new File(file);

    if (files.exists()) {
        files.delete();
        return true;
    } else {
        return false;
    }
}


/*
* 录音文件上传
* */
export async function start(params = null) {

    construct(); //初始化

    log_time("start");

    /*
    * 获取通话记录
    * */
    let record = [];
    let error = 0; //支持的错误次数

    /*
    * 获取数据
    * */
    while (record.length == 0) {


        record = await getRecord(params.start);
        await sleep(1000); //等待1s

        error++; //错误加1

        if (error > 6) {
            return {
                code: 0,
                errMsg: "通话记录读取失败，系统异常！"
            }
        }
    }

    let need = record[record.length - 1]; //需要的


    /*
    * 拼接参数
    * */
    let param = {
        call_time: need.callTime.format("YYYY-MM-DD HH:mm:ss"),
        from_phone: params.from_phone,
        to_phone: need.mobile,
        duration: need.talkTime,
        type: need.type
    };


    /*
    * 如果只需要通时通次
    * 直接提交数据
    * */
    if (param == true) {
        /*
        * 同时通次
        * */
        let result = await notice(param);

        /*
        * 返回结果
        * */
        result.duration = need.talkTime;
        result.from_phone = need.mobile;

        return result;
    }


    let a_path = getRecordPath();//获取手机录音存储的目录

    /*
    * 判断能否获取录音存储目录
    * */
    if (!a_path) {

        return {
            code: 0,
            errMsg: "录音文件存储目录获取失败！"
        }

    }


    const audio = readDirs(a_path);//获取最新的录音文件


    /*
    * 读取录音文件
    * */
    if (!audio) {
        return {
            code: 0,
            errMsg: "录音文件读取失败，如果您的通话已接通，请检查手机是否开启了自动录音！"
        }
    }


    /*
    * 判断录音文件生成的时间是否在通话开始之后
    * */
    if (need.callTime.toDate().getTime() > audio.datetime) {
        return {
            code: 0,
            errMsg: "录音文件未找到！"
        }
    }


    /*
    * 将录音文件复制到应用存储目录
    * */
    const last_audio = copy(audio.filepath); //路径


    /*
    * 开始上传
    * */

    const result = await upload(last_audio, param);

    /*
    * 返回结果
    * */
    deleteFile(audio.filepath);//删除产生的录音文件
    result.duration = need.talkTime;
    result.from_phone = need.mobile;
    result.audioNumber = audio.number ? audio.number : 0; //返回文件数量


    return result;

}

/*
* 获取通话状态
* 0,空闲
* 2,正在拨号、活动或保持的呼叫
* 0未通话，1，呼入，2通话中
* */
export function getState() {
    construct(); //初始化
    return teleManager.getCallState();
}


/*
* 后台应用弹出到前台
* */
export function moveTop() {
    construct(); //初始化
    const main = plus.android.runtimeMainActivity();//当前的activety
    ActivityManager.moveTaskToFront(main.getTaskId(), 0);//弹出窗口
}


/**
 * 清理录音
 */
export function deletAudios() {

    const save_path = getRecordPath();//获取手机录音存储的目录

    /*
    * 判断能否获取录音存储目录
    * */
    if (!save_path) {
        load.error("录音目录读取失败！");
        return;
    }


    const Dirs = new File(save_path);
    const files = Dirs.listFiles();


    /*
    * 判断是否存在录音文件
    * */
    if (!files) {
        load.error("录音读取失败！");
        return;
    }

    /*
    * 排除目录
    * */
    let count = 0; //已清理的数量
    files.forEach(function (item) {
        if (item.isFile()) {
            if (deleteFile(item.getAbsolutePath())) {
                count++; //计数
            }
        }
    })

    load.info("清理完成！共删除" + count + "个录音文件！");
}
