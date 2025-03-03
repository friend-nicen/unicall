<script>

	
	export default {
		onLaunch: function() {
			/* 申请相机权限 */
			//#ifdef APP-PLUS
				this.permiss();
			//#endif
		},
		methods:{
			
			/* 请求相机权限的函数 */
			permiss: function() {
			
				let that = this;
			
				//监听底部中间菜单的事件
				plus.android.requestPermissions([
						'android.permission.CAMERA',
						'android.permission.RECORD_AUDIO',
						'android.permission.MODIFY_AUDIO_SETTINGS',
						'android.permission.READ_PHONE_STATE',
						'android.permission.WRITE_EXTERNAL_STORAGE',
						'android.permission.CALL_PHONE',
						'android.permission.REORDER_TASKS',
						'android.permission.SYSTEM_ALERT_WINDOW',
						'android.permission.READ_CALL_LOG',
						'android.permission.WRITE_CALL_LOG',
						'android.permission.READ_CONTACTS',
						'android.permission.READ_SMS'
					],
					function(e) {				
						console.log(e);
					},
					function(e) {
						console.log(e);
						that.denial();
					});
			
			},
			
			/* 弹窗后退出应用 */
			denial: function() {
				/*弹出提醒后退出应用 */
				uni.showToast({
					icon: "error",
					title: "权限被拒绝！"
				})
			
				setTimeout(() => {
					plus.runtime.quit();
				}, 2000)
			
			}
			
		}
	}
</script>

