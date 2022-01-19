<template>
	<view>
		<view class="user-info">
			<image class="avatar" :src="user.avatar || '/static/img/avatar.png'"></image>
			<view>{{ user.name }}</view>
		</view>

		<view class="list-qw">
			<view>
				重生:
				<span>{{ user.re_num }}</span>
			</view>
		</view>
		<view class="list-qw">
			<view>
				通关:
				<span>{{ user.success_num }}</span>
			</view>
		</view>
		<view class="list-qw" v-for="(item, index) in life_data" :key="index">
			<view>
				{{ PRO_ENUM[index] }}:
				<span>{{ item }}</span>
			</view>
		</view>
	</view>
</template>

<script>
import config from '@/conifg.js';
const HOST = config.host;

const PRO_ENUM = {
	CHR: '颜值巅峰',
	INT: '智力巅峰',
	STR: '体质巅峰',
	MNY: '家境巅峰',
	SPR: '快乐巅峰',
	SUM: '数据巅峰',
};

export default {
	data() {
		return {
			PRO_ENUM,

			life_data: {},
			user: {},
			userid: 0,
		};
	},

	onLoad(option) {
		this.userid = option.userid;
		this.getData();
	},
	onShareAppMessage(e) {
		let txt = `我重开了${this.user.re_num}把人生，太好玩了!`;
		return {
			title: txt,
			path: '/pages/index/index',
			imageUrl: '/static/img/logo.png',
		};
	},
	onShareTimeline() {
		let txt = `我重开了${this.user.re_num}把人生，太好玩了!`;
		return {
			title: txt,
		};
	},
	methods: {
		getData() {
			uni.request({
				url: `${HOST}life/data/${this.userid}`,
				method: 'GET',
				success: res => {
					this.life_data = res.data.life;
					this.user = res.data.user;
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.user-info {
	margin-bottom: 20rpx;
	color: #f37b1d;
	flex-direction: column;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 60rpx 0 30rpx 0;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #ccc;
	font-size: 44rpx;
}
.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-bottom: 10rpx;
}
.list {
	padding: 30rpx;
	font-size: 36rpx;
	color: #333;
	&-me {
		text-align: center;
		margin-bottom: 20rpx;
		font-size: 38rpx;
		color: #333;
	}
	&-qw:last-child {
		border-bottom: none !important;
	}
	&-qw {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #ccc;
		width: 80%;
		margin: 0 auto;

		span {
			font-weight: bold;
			font-size: 46rpx;
			color: #f37b1d;
			margin-left: 10rpx;
		}
		&-info {
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
			margin-bottom: 20rpx;
		}
	}
}
</style>
