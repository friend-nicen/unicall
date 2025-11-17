<template>
	<web-view id='wv' class="webview" src="https://call.nicen.cn/app/index.html" @message="onPostMessage" />
</template>
<script setup>
	import Scanner from "@/uni_modules/friend-test";
	import load from "@/common/load";

	/* 工具类 */
	const scanner = new Scanner();

	/* 主域名 */
	const host = "call.nicen.cn";
	let _wv = null; /* webview对象 */

	/* 消息监听 */
	const onPostMessage = (e) => {

		/* 数据 */
		const _list = e.detail.data;
		const _action = _list[0].action;
		const _data = _list[0].data;


		/* 初始化 */
		if (!_wv) {

			/* 获取webview对象 */
			const _wvs = plus.webview.getDisplayWebview().filter(wv => {
				return wv.getURL().indexOf(host) > -1;
			});

			/* 弹出异常 */
			if (!_wvs.length) {
				load.toast("服务异常");
				return;
			}

			/* webview对象 */
			_wv = _wvs[0];
			_wv.onCall = (action, success, payload) => {
				_wv.evalJS('window.__onCall(`' + JSON.stringify({
					action,
					success,
					payload
				}) + '`)');
			}
		}

		/* 判断对象是否有这个属性 */
		try {
			if (!!scanner[_action]) {
				_wv.onCall(_action, true, scanner[_action](_data));
			}
		} catch (e) {
			const match = e.message.match(/errMsg='([^']+)'/);
			_wv.onCall(_action, false, match && match[1] ? match[1] : '系统异常');
		}


	}
</script>