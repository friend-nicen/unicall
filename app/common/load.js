let loading = 0; //加载的数量
let timer = null; //定时器

function objToText(obj) {
	/* 未定义 */
	if (typeof obj === 'undefined') {
		obj = "加载失败...";
	}
	/* 转换对象 */
	if (typeof obj === 'object' && obj !== null) {
		obj = JSON.stringify(obj);
	}

	return obj;
}


export default {
	/* 显示加载动画 */
	loading(text = "加载中") {

		if (loading === 0) {
			uni.showLoading({
				title: text,
				mask: true
			});
		}

		loading++; //弹窗+1
	},
	/* 隐藏加载 */
	loaded(time = 300, force = false) {

		/* 没有弹窗 */
		if (loading === 0) {
			return;
		}

		if (loading >= 1) {
			loading--; //弹窗减一
		}

		if (force) {
			loading = 0;
		}


		/* 需要关闭弹窗 */
		if (loading === 0) {
			if (time) {
				timer = setTimeout(() => {
					uni.hideLoading();
					clearTimeout(timer);
				}, time);
			} else {
				uni.hideLoading();
			}
		}
	},
	/* 成功提示 */
	toast: function(text) {
		this.loaded(0, true);
		uni.showToast({
			title: objToText(text),
			duration: 2500,
			icon: 'none'
		});
	},
	/* 成功提示 */
	success: function(text) {
		this.loaded(0, true);
		uni.showToast({
			mask: true,
			icon: "success",
			title: objToText(text),
			duration: 2000
		});

	},
	/* 错误提示 */
	error: function(text) {
		this.loaded(0, true);
		uni.showModal({
			title: '提示',
			showCancel: false,
			content: objToText(text)
		});

	},
	/* 确认框 */
	confirm: function(text, callback = null) {

		this.loaded(0, true);

		uni.showModal({
			title: '温馨提示',
			content: objToText(text),
			success: function(res) {
				if (res.confirm && callback) {
					callback()
				}
			}
		});
	},
	/* 信息框 */
	info: function(text, callback = null, option = {}) {

		this.loaded(0, true);

		uni.showModal(Object.assign({
			title: '温馨提示',
			showCancel: false,
			content: objToText(text),
			success: function(res) {
				if (callback) {
					callback(res)
				}
			}
		}, option));
	}
}