<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view
					class="cu-item flex-sub"
					:class="index == TabCur ? 'text-orange cur' : ''"
					v-for="(item, index) in rank_types"
					:key="index"
					@tap="tabSelect"
					:data-id="index"
				>
					{{ item.name }}
				</view>
			</view>
		</scroll-view>

		<view class="list">
			<block v-if="type != 3">
				<view class="list-me">你的排名：{{ _me_rank }}</view>
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view class="list-item-box">
						<view class="list-item-box-tip">
							<block v-if="index < 3">
								<i v-if="index == 0" class="iconfont">&#xe66d;</i>
								<i v-if="index == 1" class="iconfont">&#xe66b;</i>
								<i v-if="index == 2" class="iconfont">&#xe66c;</i>
							</block>
							<block v-else>{{ index + 1 }}</block>
						</view>
						<image class="avatar" :src="item.avatar || '/static/img/avatar.png'"></image>
						<view :style="item.id == userid ? 'color:#f37b1d;' : ''">{{ item.name }}</view>
					</view>
					<view v-if="type == 1">重生{{ item.re_num }}次</view>
					<view v-else-if="type == 2">通关{{ item.success_num }}次</view>
				</view>
			</block>

			<block v-else>
				<view class="list-qw" v-for="(item, index) in list" :key="index">
					<view class="list-qw-info">
						<image class="avatar" :src="item.avatar || '/static/img/avatar.png'"></image>
						<view :style="item.id == userid ? 'color:#f37b1d;' : ''">{{ item.name }}</view>
					</view>
					<view>
						{{ PRO_ENUM[item.type] }}:
						<span>{{ item.value }}</span>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import config from '@/conifg.js';
const HOST = config.host;

const PRO_ENUM = {
	CHR: '颜值巅峰',
	INT: '智力超群',
	STR: '体质过人',
	MNY: '名门贵族',
	SPR: '无忧无虑',
	SUM: '数据为王',
};

export default {
	data() {
		return {
			PRO_ENUM,
			rank_types: [
				{
					type: 1,
					name: '重生榜',
				},
				{
					type: 2,
					name: '通关榜',
				},
				{
					type: 3,
					name: '趣味榜',
				},
			],
			list: [],
			TabCur: 0,
			scrollLeft: 0,

			me_rank: 0,
			userid: 0,
		};
	},
	onLoad(option) {
		this.userid = option.userid;
		this.getRank();
	},
	computed: {
		_me_rank() {
			let has = false;
			this.list.some((item, index) => {
				if (item.id == this.userid) {
					has = index + 1;
					return true;
				}
			});
			if (has) {
				return has;
			}
			if (this.me_rank > 1000) {
				return '1000+';
			}
			return this.me_rank
		},
		type() {
			return this.rank_types[this.TabCur].type;
		},
	},
	onShareAppMessage(e) {
		let txt = "如果人生能重开？快来玩玩2亿人都在玩的爆火游戏"
		if (this.type != 3) {
			txt = `我在${this.type == 1 ? '重开' : '通关'}榜排第${this._me_rank}名!快来一起玩呀`;
		}  
		return {
			title: txt,
			path: '/pages/index/index',
			imageUrl: '/static/img/logo.png',
		};
	},
	onShareTimeline() {
		let txt = "如果人生能重开？快来玩玩2亿人都在玩的爆火游戏"
		if (this.type != 3) {
			txt = `我在${this.type == 1 ? '重开' : '通关'}榜排第${this._me_rank}名!快来一起玩呀`;
		}  
		return {
			title: txt,
		};
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			this.getRank();
		},
		getRank() {
			uni.request({
				url: `${HOST}life/rank/${this.type}/${this.userid}`,
				method: 'GET',
				success: res => {
					let list = res.data.lists;
					let key = '';
					list.sort((item1, item2) => {
						if (this.type == 1) {
							key = 're_num';
						} else if (this.type == 2) {
							key = 'success_num';
						}
						if (item1[key] > item2[key]) {
							return -1;
						} else if (item1[key] < item2[key]) {
							return 1;
						}
						return 0;
					});
					this.list = list;
					this.me_rank = res.data.me_rank;
					uni.stopPullDownRefresh();
				},
			});
		},
	},
	onPullDownRefresh() {
		this.getRank();
	},
};
</script>

<style lang="scss" scoped>
.iconfont {
	color: red;
	font-size: 44rpx;
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
		padding: 20rpx 0;
		border-bottom: 1rpx solid #ccc;
		span {
			font-weight: bold;
			font-size: 46rpx;
			color: #f37b1d;
		}
		&-info {
			display: flex;
			    flex-direction: column;
			    justify-content: center;
			    align-items: center;
		}
		.avatar {
		    width: 60rpx;
		    height: 60rpx;
			border-radius: 50%;
		}
	}
	&-item {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #ccc;
		&-box {
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
			&-tip {
				width: 68rpx;
				text-align: center;
				font-size: rpx;
			}
		}
	}
}

.avatar {
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	margin-right: 6rpx;
	margin-bottom: -2rpx;
}
</style>
