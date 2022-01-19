<script>
import Vue from 'vue';
export default {
	onLaunch: function() {
		console.log('App Launch');
		this.checkForUpdate();
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		//判断是否有新版本
		checkForUpdate() {
			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										updateManager.applyUpdate();
									}
								},
							});
						});
						updateManager.onUpdateFailed(function() {
							wx.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
							});
						});
					}
				});
			} else {
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
				});
			}

			Vue.prototype.ColorList = [
				{
					title: '嫣红',
					name: 'red',
					color: '#e54d42',
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d',
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08',
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f',
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a',
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4',
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff',
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6',
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0',
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997',
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f',
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3',
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa',
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333',
				},
				{
					title: '雅白',
					name: 'white',
					color: '#ffffff',
				},
			];
		},
	},
};
</script>

<style>
@import 'static/colorui/main.css';
@import 'static/colorui/icon.css';
@import 'static/css/font.css';
</style>
