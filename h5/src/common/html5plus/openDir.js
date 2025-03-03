/*
* 安卓打开指定的文件目录
* %2fDCIM%2fCamera%2f
* */

import {getRecordPath} from './monitor'

let main, Intent, Uri, loaded;

export default function () {


    const path = getRecordPath(); //获取文件目录

    /*
    * 缓存加载
    * */
    if (!loaded) {
        main = plus.android.runtimeMainActivity();
        Intent = plus.android.importClass('android.content.Intent')
        Uri = plus.android.importClass("android.net.Uri");
        loaded = true;
    }

    let uri = Uri.parse("content://com.android.externalstorage.documents/document/primary:" + path.replace(/\//g, '%2f'));
    let intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);

    intent.addCategory(Intent.CATEGORY_OPENABLE);
    intent.setType("*/*");//想要展示的文件类型
    intent.putExtra('android.provider.extra.INITIAL_URI', uri);

    main.startActivityForResult(intent, 0);


}