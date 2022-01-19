<template>
	<view class="container">
		<view class="DrawerClose" :class="drawer ? 'show' : ''" @tap="toggleDrawer()">
			<text class="cuIcon-pullright"></text>
		</view>
		<scroll-view scroll-y class="DrawerWindow" :class="drawer ? 'show' : ''">
			<view class="left">
				<view class="left-top bg-gradual-blue padding-lr-xl">
					<view class="left-top-name">
						<view style="width: 120rpx;">
							<image class="left-top-avatar" :src="auth.avatar || '/static/img/avatar.png'"></image>
						</view>
						<input
							maxlength="10"
							:value="name_change"
							@confirm="saveName"
							@blur="saveName"
							@input="changeName"
						/>
					</view>
				</view>

				<view class="left-main">
					<view>
						<navigator hover-class="none" @tap="showPre">
							<i class="iconfont">&#xe606;</i>
							<view>好友</view>
						</navigator>
						<navigator hover-class="none" :url="'/pages/rank/rank?userid=' + auth.id">
							<i class="iconfont">&#xe651;</i>
							<view>试炼榜</view>
						</navigator>
						<navigator hover-class="none" :url="'/pages/life_data/life_data?userid=' + auth.id">
							<i class="iconfont">&#xe60c;</i>
							<view>人生簿</view>
						</navigator>
		<!-- 				<navigator hover-class="none" @tap="showPre">
							<i class="iconfont">&#xe8ba;</i>
							<view>一起玩</view>
						</navigator> -->
					</view>
					<view>
						<navigator hover-class="none" @tap="showLog">
							<i class="iconfont">&#xe8ae;</i>
							<view>日志预告</view>
						</navigator>
						<navigator hover-class="none">
							<i class="iconfont">&#xe690;</i>
							<button open-type="contact">意见反馈</button>
						</navigator>
						<navigator hover-class="none">
							<i class="iconfont">&#xe6e4;</i>
							<view>版本 {{ config.version }}</view>
						</navigator>
					</view>
				</view>

				<view class="copyright">
					<view style="margin-bottom: 30rpx;font-size: 24rpx;">
						已重开{{ re_num }}次,通关{{ success_num }}次
					</view>
					<view @tap="copy()">改编自开源程序 VickScarlet/lifeRestart 点击复制</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import config from '@/conifg.js';
const HOST = config.host;

export default {
	name: 'LeftMain',
	props: {
		drawer: Boolean,
		auth: Object,
		re_num: String,
		success_num: String,
	},
	data() {
		return {
			config,
			name_change: '',
		};
	},
	mounted() {
		this.name_change = this.auth.name;
	},
	methods: {
		toggleDrawer() {
			this.$emit('toggleDrawer');
		},
		showLog() {
			this.$emit('showLog');
		},
		changeName(e) {
			this.name_change = e.detail.value;
		},
		saveName() {
			if (this.name_change == this.auth.name) {
				return;
			}
			if (!this.name_change) {
				this.name_change = this.auth.name;
				return;
			}
			uni.request({
				url: `${HOST}user/update-name`,
				method: 'POST',
				data: {
					name: this.name_change,
					avatar: '',
					id: this.auth.id,
				},
				success: res => {
					let auth = this.auth;
					auth.name = this.name_change;
				},
			});
		},
		showPre() {
			this.toast('开发中...敬请期待');
		},

		toast(title) {
			uni.showToast({
				icon: 'none',
				title,
			});
		},
		
		copy() {
			uni.setClipboardData({
				data: 'https://liferestart.syaro.io/',
				success: res => {
					wx.getClipboardData({
						success: () => {
							this.toast('链接已复制，请去浏览器打开');
						},
					});
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
button {
	line-height: 1;
	margin: 0;
	padding: 0;
}
button::after {
	border: none;
}
input {
	outline: none;
	border: none;
	list-style: none;
}
.DrawerWindow {
	z-index: 999;
	background-color: #fff;
}

.left {
	width: 100%;

	&-top {
		color: #ffffff;
		background-color: #007aff;
		padding-bottom: 30rpx;
		padding-top: 80rpx;
		background-image: linear-gradient(45deg, #333, #999) !important;
		&-avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
		&-name {
			font-weight: bold;
			font-size: 36rpx;
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}
	}

	&-main {
		padding: 20rpx 0 50rpx 36rpx;
		font-size: 36rpx;
		color: #434343;

		navigator,
		.navigator-item {
			margin: 38rpx 0;
			display: flex;
			align-items: center;

			i {
				margin-right: 20rpx;
				font-size: 40rpx;
			}
		}

		& > view {
			border-bottom: 1rpx solid #f8f8f8;
		}
	}
}

.DrawerPage {
	position: fixed;
	width: 100vw;
	height: 100vh;
	left: 0vw;
	background-color: #f1f1f1;
	transition: all 0.4s;
}

.DrawerPage.show {
	transform: scale(0.9, 1);
	left: 85vw;
	box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
	transform-origin: 0;
}

.DrawerWindow {
	position: absolute;
	width: 85vw;
	height: 100vh;
	left: 0;
	top: 0;
	transform: scale(0.9, 0.9) translateX(-100%);
	opacity: 0;
	pointer-events: none;
	transition: all 0.4s;
}

.DrawerWindow.show {
	transform: scale(1, 1) translateX(0%);
	opacity: 1;
	pointer-events: all;
}

.DrawerClose {
	position: absolute;
	width: 40vw;
	height: 100vh;
	right: 0;
	top: 0;
	color: transparent;
	padding-bottom: 30upx;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
	letter-spacing: 5px;
	font-size: 50upx;
	opacity: 0;
	pointer-events: none;
	transition: all 0.4s;
}

.DrawerClose.show {
	opacity: 1;
	pointer-events: all;
	width: 15vw;
	color: #fff;
}

.DrawerPage .cu-bar.tabbar .action button.cuIcon {
	width: 64upx;
	height: 64upx;
	line-height: 64upx;
	margin: 0;
	display: inline-block;
}

.DrawerPage .cu-bar.tabbar .action .cu-avatar {
	margin: 0;
}

.DrawerPage .nav {
	flex: 1;
}

.DrawerPage .nav .cu-item.cur {
	border-bottom: 0;
	position: relative;
}

.DrawerPage .nav .cu-item.cur::after {
	content: '';
	width: 10upx;
	height: 10upx;
	background-color: currentColor;
	position: absolute;
	bottom: 10upx;
	border-radius: 10upx;
	left: 0;
	right: 0;
	margin: auto;
}

.DrawerPage .cu-bar.tabbar .action {
	flex: initial;
}

.copyright {
	position: fixed;
	text-align: center;
	width: 100%;
	bottom: 10rpx;
	font-size: 22rpx;
	color: #333;
}
</style>
