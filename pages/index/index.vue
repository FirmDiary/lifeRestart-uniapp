<template>
	<view
		class="content"
		:style="{
			'--padding-top': system.statusBarHeight + 'px',
		}"
	>
		<block v-if="load_over">
			<view class="main">
				<block v-if="step == 1">
					<LeftMain
						v-if="auth.id"
						v-on:toggleDrawer="toggleDrawer()"
						v-on:showLog="showLog()"
						:auth="auth"
						:re_num="re_num"
						:success_num="success_num"
						:drawer="drawer"
					></LeftMain>
					<button
						id="rank"
						style="width: 160rpx;top:calc(var(--padding-top) + 140rpx);left: auto;right: 30rpx;top: calc(var(--padding-top) + 100rpx);"
						@tap="toggleDrawer()"
					>
						菜单
					</button>
					<button
						id="rank"
						style="width: 160rpx;top:calc(var(--padding-top) + 140rpx);color: red;font-weight: 500;"
						@tap="goGlXx(2)"
					>
						一起玩
					</button>
					<button id="rank" @tap="goMini()" style="width: 160rpx;padding: 3rpx 20rpx;">照片上色</button>
					<button
						id="rank"
						v-if="auth.id"
						style="width: 160rpx;top:calc(var(--padding-top) + 240rpx)"
						@tap="goRank"
					>
						试炼榜
					</button>
					<view id="title">
						修仙人生
						<br />
						<view style="font-size: 36rpx;font-weight: normal;margin-top: 10rpx;">
							试炼之路，百炼成仙🧕
						</view>
					</view>
					<button @tap="start2" class="mainbtn">立即重开</button>

					<view class="copyright">
						<view v-if="auth.id" style="margin-bottom: 30rpx;font-size: 26rpx;">
							已重开{{ re_num }}次,通关{{ success_num }}次
						</view>
						<view @tap="copy()">改编自开源程序 VickScarlet/lifeRestart 点击复制</view>
					</view>
				</block>

				<block v-if="step == 2">
					<view class="head" style="font-size:42rpx;">天赋抽卡</view>
					<button v-if="!pools" id="random" class="mainbtn" style="top: 24%;" @tap="getPools()">
						经典模式
					</button>
					<button
						id="random"
						v-if="!pools"
						class="mainbtn"
						style="top: 34%;background-color: #000;color: red;"
						@tap="goGlXx(1)"
					>
						修仙攻略
					</button>

					<button
						v-if="!pools && (shares.pj < 3 || !video_ad)"
						id="random"
						class="mainbtn"
						style="top: 52%;background-color: #000;color: #fff;"
						open-type="share"
					>
						分享群聊开启修仙版
					</button>

					<button
						v-if="!pools && video_ad"
						id="random"
						class="mainbtn"
						style="top: 43%;background-color: #000;color: #fff;"
						@tap="pj()"
					>
						看广告开启修仙版
					</button>

					<view v-if="!pools" class="adContainer">
						<ad unit-id="adunit-3ea0e8f992a8a17e" ad-type="video" ad-theme="white"></ad>
					</view>

					<ul id="talents" v-if="pools" class="selectlist">
						<li
							v-for="(pool, index) in pools"
							:key="index"
							@tap="select(index)"
							:class="'grade' + pool.grade + 'b ' + (pool.selected ? 'selected' : '')"
						>
							{{ pool.name }}({{ pool.desc }})
						</li>
					</ul>
					<button
						v-if="pools && !pool_special && !pools_is_pj && (shares.tf < 5 || !video_ad)"
						id="next"
						open-type="share"
						class="mainbtn"
						style="top: auto;bottom: 230rpx;background-color: #000;color: #fff;"
					>
						分享刷高级天赋
					</button>
					<button
						v-if="pools && video_ad && !pools_is_pj"
						id="next"
						class="mainbtn"
						style="top: auto;bottom: 120rpx;background-color: #000;color: red;"
						@tap="lookVideo(1)"
					>
						究极爆刷50选10
					</button>

					<button id="next" v-if="pools" @tap="start3()" class="mainbtn" style="top:auto; bottom:0.1em">
						{{ tsids.length == TS_NUM ? '开始新人生' : `请选择${TS_NUM}个天赋` }}
					</button>
				</block>

				<block v-if="step == 3">
					<view id="main">
						<view class="head" style="font-size: 46rpx">
							调整初始属性
							<br />
							<view id="total" style="font-size:1rem; font-weight:normal;">
								可用属性点：{{ pro_dot_num }}
							</view>
						</view>
						<ul id="propertyAllocation" class="propinitial">
							<li v-for="(item, index) in pro" :key="index">
								<view class="iconc" @tap="subPro(index)">-</view>
								<view>{{ PRO_ENUM[index] }}{{ item }}</view>
								<view class="iconc" @tap="addPro(index)">+</view>
							</li>
						</ul>
						<ul class="selectlist" id="talentSelectedView" style="top:calc(100% - 49vh); bottom:7rem">
							<li>已选天赋</li>
							<li
								v-for="(pool, index) in pools"
								:key="index"
								v-if="pool.selected"
								:class="'grade' + pool.grade + 'b'"
							>
								{{ pool.name }}({{ pool.desc }})
							</li>
						</ul>

						<button
							v-if="!tsids_is_added && !pools_is_pj && (shares.jd < 3 || !video_ad)"
							id="next"
							open-type="share"
							class="mainbtn"
							style="top: auto;bottom: 248rpx;background-color: #000;color: #fff;"
						>
							分享好友加10属性点
						</button>
						<button
							v-if="!tsids_is_added && video_ad && !pools_is_pj"
							id="next"
							class="mainbtn"
							style="top: auto;bottom: 140rpx;background-color: #000;color: red;"
							@tap="lookVideo(2)"
						>
							看视频加15属性点
						</button>
						<button
							id="start"
							@tap="run()"
							class="mainbtn"
							style="top:auto; bottom:0.1rem; left:50%; right:auto; transform: translate(-50%,-50%);"
						>
							开始新人生
						</button>
					</view>
				</block>

				<block v-if="step == 4">
					<view id="main">
						<view class="main-4-top">
							<ul id="lifeProperty" class="lifeProperty">
								<li>颜值{{ life[life_step].pro.CHR }}</li>
								<li>智力{{ life[life_step].pro.INT }}</li>
								<li>体质{{ life[life_step].pro.STR }}</li>
								<li>家境{{ life[life_step].pro.MNY }}</li>
								<li>快乐{{ life[life_step].pro.SPR }}</li>
							</ul>
						</view>
						<ul id="lifeTrajectoryBox" class="lifeTrajectory" @tap="handStep()">
							<li v-for="(life, index) in life_history" :key="index">
								<view v-if="life.pro.AGE != 0">年龄：{{ life.pro.AGE }}</view>
								<view>{{ life.text }}</view>
							</li>
							<view class="lifeTrajectoryBox-placeholder">
								<button
									v-if="!life_over"
									@tap.stop="switchStepType()"
									class="mainbtn"
									style="top:auto; bottom:0rem; left:50%; right:auto; transform: translate(-50%,-50%);"
								>
									点击{{ auto_step_is_doing ? '手动' : '自动' }}
								</button>

								<button
									v-if="!life_over && auto_step_is_doing"
									@tap.stop="switchStepTimeType()"
									class="mainbtn"
									style="height: 100rpx;top: auto;bottom: 0rem;left: 85%;right: auto;transform: translate(-50%,-50%);width: 100rpx;box-sizing: border-box;border-radius: 50%;padding: 0;font-size: 32rpx;line-height: 100rpx;"
								>
									X{{ auto_step_time_type == 1 ? 2 : 1 }}
								</button>

								<button
									v-if="!life_over && video_ad"
									@tap.stop="speedLife()"
									class="mainbtn"
									style="top:auto; bottom:4.0rem; left:50%; right:auto; transform: translate(-50%,-50%);color: #fff;background-color: #000"
								>
									时光穿梭
								</button>
								<button
									v-if="!life_over && !video_ad"
									open-type="share"
									class="mainbtn"
									style="top:auto; bottom:4.0rem; left:50%; right:auto; transform: translate(-50%,-50%);color: #fff;background-color: #000"
								>
									时光穿梭
								</button>
								<button
									v-if="life_over"
									@tap="lookRes()"
									class="mainbtn"
									style="top:auto; bottom:4.0rem; left:50%; right:auto; transform: translate(-50%,-50%);"
								>
									人生总结
								</button>
								<!-- 							<button
								v-if="life_over"
								@tap="reRun()"
								class="mainbtn"
								style="top:auto; bottom:0.1rem; left:50%; right:auto; transform: translate(-50%,-50%);"
							>
								重开人生
							</button> -->
							</view>
						</ul>
					</view>
				</block>

				<block v-if="step == 5">
					<view id="main">
						<view class="head">人生总结</view>
						<ul id="judge" class="judge">
							<li :class="'grade' + pro_res['CHR'].grade">
								<span>颜值：</span>
								<span>{{ pro.CHR }} {{ pro_res['CHR'].judge }}</span>
							</li>
							<li :class="'grade' + pro_res['INT'].grade">
								<span>智力：</span>
								<span>{{ pro.INT }} {{ pro_res['INT'].judge }}</span>
							</li>
							<li :class="'grade' + pro_res['STR'].grade">
								<span>体质：</span>
								<span>{{ pro.STR }} {{ pro_res['STR'].judge }}</span>
							</li>
							<li :class="'grade' + pro_res['MNY'].grade">
								<span>家境：</span>
								<span>{{ pro.MNY }} {{ pro_res['MNY'].judge }}</span>
							</li>
							<li :class="'grade' + pro_res['SPR'].grade">
								<span>快乐：</span>
								<span>{{ pro.SPR }} {{ pro_res['SPR'].judge }}</span>
							</li>
							<li :class="'grade' + pro_res['AGE'].grade">
								<span>享年：</span>
								<span>{{ pro.AGE }} {{ pro_res['AGE'].judge }}</span>
							</li>
							<li :class="'grade' + pro_res['SUM'].grade">
								<span>总评：</span>
								<span>{{ pro.SUM }} {{ pro_res['SUM'].judge }}</span>
							</li>
						</ul>

						<view class="re-grade">
							<ul id="talents" class="selectlist" style="flex: 0 1 auto;top: 61%;">
								<view>天赋，你可以选一个，下辈子还能抽到</view>
								<li
									v-for="(pool, index) in pools"
									:key="index"
									v-if="pool.selected"
									@tap="preSelect(pool)"
									:class="
										'grade' +
											pool.grade +
											'b ' +
											(pool_pre_selected.id == pool.id ? 'selected' : '')
									"
								>
									{{ pool.name }}({{ pool.desc }})
								</li>
							</ul>
						</view>

						<button
							id="next"
							open-type="share"
							class="mainbtn"
							style="top: auto;bottom: 0.1rem;background-color: #000;color: #fff;right: auto;left: 72%;"
						>
							邀请好友挑战
						</button>
						<button
							@tap="reRun()"
							class="mainbtn"
							style="top:auto; bottom:0.1rem; left:24%; right:auto; transform: translate(-50%,-50%);"
						>
							重开人生
						</button>
					</view>
				</block>
			</view>

			<view class="cu-modal" :class="log_show ? 'show' : ''">
				<view class="cu-dialog" style="height: 67vh;">
					<view class="cu-bar bg-white justify-end">
						<view class="content">日志预告</view>
						<view class="action" @tap="showLog()"><text class="cuIcon-close text-red"></text></view>
					</view>
					<view class="padding-xl logs">{{ LOG }}</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import LeftMain from '@/components/left_main.vue';
import config from '@/conifg.js';
import { summary } from '../../utils/summary.js';

const HOST = config.host;
const TS_NUM = 3;
const PRO_ENUM = {
	CHR: '颜值',
	INT: '智力',
	STR: '体质',
	MNY: '家境',
	SPR: '快乐',
	// LIF: '生命',
};
const PRO_DEFAULT = {
	CHR: 0,
	INT: 0,
	STR: 0,
	MNY: 0,
};
let AUTO_TIME = config.auto_time;

// 在页面中定义激励视频广告
let videoAd = null;

const LOG = config.log;

export default {
	components: {
		LeftMain,
	},
	data() {
		return {
			TS_NUM,
			PRO_ENUM,
			summary,
			AUTO_TIME,
			LOG,
			config,

			load_over: false,

			show_ad: {
				1: true,
				2: true,
				3: true,
				4: true,
				5: true,
			},
			video_ad: false,

			system: {},

			step: 1,
			pools: null,
			pool_pre_selected: null,
			tsids: [],

			pro_dot_num_max: 20,
			pro_dot_num: 20,
			pro: PRO_DEFAULT,
			pro_res: {},

			life: [],
			life_step: 0,
			life_history: [],

			auto_step: null,
			auto_step_is_doing: false,
			auto_step_time_type: 1,

			is_sharing: false,
			pool_special: 0,
			tsids_is_added: false,

			log_show: false,

			life_over: false,

			pools_is_pj: false,

			auth: {},
			re_num: 0,
			success_num: 0,
			drawer: !1,
			touchStartX: 0,

			shares: {
				pj: 0,
				tf: 0,
				jd: 0,
				// 'js':0,
			},
		};
	},
	onLoad() {
		uni.request({
			url: `${HOST}info/published/${config.app}`,
			method: 'GET',
			data: {},
			success: res => {
				console.log(res.data);
				if (res.data == '0') {
					uni.reLaunch({
						url: '/pages/article/article',
					});
				}
				this.load_over = true;
			},
		});
		this.system = uni.getSystemInfoSync();
		let shares = uni.getStorageSync('share');
		console.log(shares);
		if (shares) {
			this.shares = shares;
		}
		this.checkLogin();

		if (config.environment != 'development') {
			// 在页面onLoad回调事件中创建激励视频广告实例
			if (wx.createRewardedVideoAd) {
				videoAd = wx.createRewardedVideoAd({
					adUnitId: config.ad.video_reward,
				});
				videoAd.onLoad(() => {
					this.video_ad = true;
				});
				videoAd.onError(err => {
					console.log('广告初始化错误');
					console.error(err);
				});
			}
		}
	},
	onUnload() {
		this.clearAutoStep();
	},
	onShow() {
		if (this.step == 2 && this.pools) {
			if (this.is_sharing) {
				//分享刷超级天赋
				this.pool_special = 1;
				this.is_sharing = false;
				this.getPools();
				this.toast('重刷成功!');
				this.shares.tf++;
				uni.setStorageSync('share', this.shares);
			}
			return;
		}
		if (this.step == 3 && this.is_sharing) {
			this.pro_dot_num_max = this.pro_dot_num_max + 10;
			this.pro_dot_num = this.pro_dot_num + 10;
			this.is_sharing = false;
			this.tsids_is_added = true;
			this.toast('加点成功!');
			this.shares.jd++;
			uni.setStorageSync('share', this.shares);
			return;
		}

		if (this.step == 4 && this.is_sharing) {
			this.speedLifeDo();
			this.is_sharing = false;
			// this.shares.js++
			uni.setStorageSync('share', this.shares);
			return;
		}

		if (this.step == 2 && !this.pools && this.is_sharing) {
			//破解
			this.pj(true);
			this.is_sharing = false;
			this.shares.pj++;
			uni.setStorageSync('share', this.shares);
			return;
		}
	},
	onShareAppMessage(e) {
		if (e.from === 'button') {
			this.is_sharing = true;
		}
		if (this.step == 5) {
			return {
				title: `如果人生能重开，太好玩了！我居然获得总评${this.pro['SUM']}(${
					this.pro_res['SUM'].judge
				})，你敢挑战吗？`,
				imageUrl: '/static/img/logo.png',
			};
		} else {
			return {
				title: '如果人生能重开？快来玩玩2亿人都在玩的爆火游戏',
				imageUrl: '/static/img/logo.png',
			};
		}
	},
	onShareTimeline() {
		if (this.step == 5) {
			return {
				title: `如果人生能重开，太好玩了！我居然获得总评${this.pro['SUM']}(${
					this.pro_res['SUM'].judge
				})，你敢挑战吗？`,
			};
		} else {
			return {
				title: '如果人生能重开？快来玩玩2亿人都在玩的爆火游戏',
			};
		}
	},
	methods: {
		checkLogin() {
			wx.login().then(res => {
				uni.request({
					url: `${HOST}user/login/${config.app}`,
					method: 'POST',
					data: {
						code: res.code,
						name: '',
					},
					success: res => {
						this.auth = res.data;
						this.re_num = this.auth.re_num;
						this.success_num = this.auth.success_num;
					},
				});
			});
		},
		start2() {
			if (this.auth.is_login == 2) {
				wx.getUserProfile({
					desc: '用于获取头像昵称',
					success: userData => {
						uni.request({
							url: `${HOST}user/update-name`,
							method: 'POST',
							data: {
								name: userData.userInfo.nickName,
								avatar: userData.userInfo.avatarUrl,
								id: this.auth.id,
							},
							success: res => {
								this.name = userData.userInfo.nickName;
								this.avatarUrl = userData.userInfo.avatarUrl;
								this.is_login = 1;
								this.step = 2;
							},
						});
					},
					fail: err => {
						console.log(err);
						this.step = 2;
					},
				});
				return;
			}
			this.step = 2;
		},
		login() {
			wx.getUserProfile({
				desc: '用于获取头像昵称',
				success: res => {
					console.log(res);
				},
			});
		},
		touchStart(e) {
			console.log(e);
			this.touchStartX = e.touches[0].clientX;
		},
		touchEnd(e) {
			let distance = this.touchStartX - e.changedTouches[0].clientX;
			if (Math.abs(distance) > 100) {
				this.drawer = distance < 0;
			}
		},
		toggleDrawer() {
			this.drawer = !this.drawer;
		},
		init() {
			this.life_step = 0;
			this.pools = null;
			this.life = this.life_history = this.tsids = [];
			this.pro = PRO_DEFAULT;
			this.pool_special = 0;
			this.tsids_is_added = this.pools_is_pj = this.is_sharing = this.life_over = false;
			this.TS_NUM = 3;
			this.AUTO_TIME = config.auto_time;
			this.auto_step_time_type = 1;
			this.clearAutoStep();
		},
		reRun() {
			this.step = 1;
			this.init();
		},
		getPools(limit = 10) {
			if (this.step != 2) {
				return;
			}
			uni.request({
				url: `${HOST}ts/pool`,
				method: 'GET',
				data: {
					special: this.pool_special,
				},
				success: res => {
					if (this.tsids.length) {
						this.pools = null;
						this.tsids = [];
					}
					if (this.pool_pre_selected) {
						this.pools = [];
						this.pools.push(this.pool_pre_selected);
						this.pools = this.pools.concat(res.data.slice(0, limit - 2));
					} else {
						console.log(limit);
						console.log(limit - 1);
						this.pools = res.data.slice(0, limit - 1);
					}

					this.$forceUpdate();
				},
			});
		},
		select(index) {
			uni.hideToast();
			if (this.pools[index].selected) {
				this.pools[index].selected = false;
				this.$forceUpdate();
			} else {
				if (this.tsids.length >= this.TS_NUM) {
					this.toast(`只可以选择${this.TS_NUM}个属性`);
					return;
				}
				this.pools[index].selected = true;
			}
			this.$forceUpdate();
			this.getTsids();
		},
		start3() {
			if (this.tsids.length != this.TS_NUM) {
				return;
			}
			if (this.pools_is_pj) {
				this.pro_dot_num = 0;
				this.step = 3;
				this.pro = {
					CHR: 10,
					INT: 10,
					STR: 10,
					MNY: 10,
				};
				return;
			}
			uni.request({
				url: `${HOST}ts/choose-pre`,
				method: 'POST',
				data: {
					tsids: this.tsids,
				},
				success: res => {
					this.pro_dot_num_max = this.pro_dot_num = res.data.total;
					this.step = 3;
					if (this.pro_dot_num_max) {
						this.randPro();
					}
				},
			});
		},
		run() {
			if (this.pro_dot_num) {
				if (this.pro.CHR + this.pro.INT + this.pro.MNY + this.pro.STR < 40) {
					this.toast(`别浪费，你还有${this.pro_dot_num}点属性点可用`);
					return;
				}
			}
			uni.request({
				url: `${HOST}ts/choose`,
				method: 'POST',
				data: {
					pros: this.pro,
					tsids: this.tsids,
				},
				success: res => {
					let life = [];
					res = res.data;
					res.forEach(item => {
						let pro = {
							AGE: 0,
							CHR: 0,
							INT: 0,
							STR: 0,
							MNY: 0,
							SPR: 0,
							// LIF: 0,
						};
						let pro_arr = item[0].split('|');
						let i = 0;
						for (let key in pro) {
							pro[key] = pro_arr[i];
							i++;
						}
						let text = '';
						item.forEach((txt, index) => {
							if (index) {
								text += txt;
								if (index + 1 != item.length) {
									text += '\n';
								}
							}
						});
						life.push({
							pro,
							text,
						});
					});
					this.pro = life[life.length - 1].pro;
					this.life = life;
					this.life_history = [];
					this.life_step = 0;
					this.step = 4;
					this.pool_pre_selected = null;
					this.lifeStep();
					this.switchStepType();
				},
			});
		},
		switchStepType() {
			if (this.auto_step_is_doing) {
				this.clearAutoStep();
				return;
			} else {
				this.auto_step_is_doing = true;
				clearInterval(this.auto_step);
				this.auto_step = setInterval(() => {
					this.lifeStep();
				}, this.AUTO_TIME / this.auto_step_time_type);
			}
		},
		switchStepTimeType() {
			this.auto_step_time_type = this.auto_step_time_type == 1 ? 2 : 1;
			this.clearAutoStep();
			this.auto_step_is_doing = true;
			clearInterval(this.auto_step);
			this.auto_step = setInterval(() => {
				this.lifeStep();
			}, this.AUTO_TIME / this.auto_step_time_type);
		},
		handStep() {
			if (this.auto_step_is_doing) {
				return;
			}
			if (this.life.length <= this.life_history.length) {
				return;
			}
			this.lifeStep();
		},
		clearAutoStep() {
			clearInterval(this.auto_step);
			this.auto_step = null;
			this.auto_step_is_doing = false;
		},
		lifeStep() {
			if (this.life_step + 1 >= this.life.length) {
				setTimeout(() => {
					this.life_over = true;
				}, this.AUTO_TIME / this.auto_step_time_type);
			}
			if (this.life.length < this.life_history.length + 1) {
				this.clearAutoStep();
				return;
			}
			if (this.life.length == 1) {
				this.life_history.push(this.life[this.life_step]);
				this.clearAutoStep();
				return;
			}
			if (this.life[this.life_step]) {
				this.life_history.push(this.life[this.life_step]);
				if (this.life_step + 1 < this.life.length) {
					this.life_step++;
				}
				this.scrollToBottom();
			}
		},
		scrollToBottom(duration = 0) {
			uni.createSelectorQuery()
				.in(this)
				.select('#lifeTrajectoryBox')
				.boundingClientRect(rect => {
					if (rect) {
						uni.pageScrollTo({
							duration: duration * 100,
							scrollTop: rect.height,
						});
					}
				})
				.exec();
		},
		toast(title) {
			uni.showToast({
				icon: 'none',
				title,
			});
		},
		getTsids() {
			let ids = [];
			if (!this.pools) {
				this.tsids = ids;
				return;
			}
			this.pools.forEach(pool => {
				if (pool.selected) {
					ids.push(pool.id);
				}
			});
			this.tsids = ids;
		},
		addPro(key) {
			if (this.pro_dot_num == 0) {
				return;
			}
			if (this.pro[key] == 10) {
				this.toast('单个属性最多10点');
				return;
			}
			this.pro[key]++;
			this.pro_dot_num--;
		},
		subPro(key) {
			if (!this.pro[key]) {
				return;
			}
			this.pro[key]--;
			this.pro_dot_num++;
		},
		randPro() {
			let i = 0;
			for (let key in this.pro) {
				if (!this.pro_dot_num) {
					this.pro[key] = 0;
				} else {
					if (i == 3) {
						if (this.pro_dot_num < 0) {
							this.pro[key] = 0;
						} else {
							this.pro[key] = this.pro_dot_num > 10 ? 10 : this.pro_dot_num;
						}
					} else {
						let rand = Math.ceil(Math.random() * 10);
						if (rand > this.pro_dot_num) {
							rand = this.pro_dot_num;
						}
						this.pro[key] = rand;
						i++;
					}
					this.pro_dot_num -= this.pro[key];
				}
			}
		},
		preSelect(pool) {
			if (this.pool_pre_selected) {
				if (this.pool_pre_selected.id == pool.id) {
					this.pool_pre_selected = null;
				} else {
					this.pool_pre_selected = pool;
				}
			} else {
				this.pool_pre_selected = pool;
			}
		},
		lookRes() {
			let sum = 0;
			for (let key in this.pro) {
				let num = parseInt(this.pro[key]);
				this.pro_res[key] = summary(key, num);
				if (key === 'AGE') {
					num = num / 2;
				} else {
					num = num * 2;
				}
				sum += num;
			}
			this.pro.SUM = Math.floor(sum);
			this.pro_res.SUM = summary('SUM', this.pro.SUM);

			this.pro.is_success = this.life[this.life.length - 1].text.indexOf('作为“人”的') != -1 ? 1 : 2;
			uni.request({
				url: `${HOST}life/save`,
				method: 'POST',
				data: {
					life: this.pro,
					id: this.auth.id,
				},
				success: res => {
					this.re_num = this.re_num + 1;
					if (this.pro.is_success == 1) {
						this.success_num = this.success_num + 1;
					}
				},
			});

			this.step = 5;
		},

		speedLifeDo() {
			this.clearAutoStep();
			uni.showLoading({
				title: '时光穿梭中...',
			});
			setTimeout(() => {
				uni.hideLoading();
				this.life_history = this.life;
				this.life_step = this.life.length - 1;
				this.toast('时光穿梭成功!');

				let time = parseInt(this.life.length / 100) || 1;
				setTimeout(() => {
					this.scrollToBottom(parseInt(time));
				}, 500);
				setTimeout(() => {
					this.life_over = true;
				}, time + 1000);
			}, 2000);
		},

		lookVideo(sence) {
			// 用户触发广告后，显示激励视频广告
			if (videoAd) {
				videoAd.onClose(res => {
					// 用户点击了【关闭广告】按钮
					if (res && res.isEnded) {
						console.log(sence);
						if (sence == 1 && this.step == 2) {
							//重刷天赋
							this.pool_special = 2;
							this.getPools(50);
							this.toast('重刷成功!');
							this.TS_NUM = 10;
							return;
						}
						if (sence == 2 && this.step == 3) {
							//属性点
							this.pro_dot_num_max = this.pro_dot_num_max + 15;
							this.pro_dot_num = this.pro_dot_num + 15;
							this.tsids_is_added = true;
							this.toast('加点成功!');
							return;
						}
						if (sence == 3 && this.step == 4) {
							//加速
							this.speedLifeDo();
							return;
						}
						if (sence == 4 && this.step == 2 && !this.pools) {
							//破解
							this.pj(true);
							return;
						}
					} else {
						this.toast('未完成任务是没有奖励得哦~');
					}
				});
				videoAd.show().catch(() => {
					// 失败重试
					videoAd
						.load()
						.then(() => videoAd.show())
						.catch(err => {
							console.log('激励视频 广告显示失败');
							console.error(err);
							this.toast('广告都被你消灭了~稍等再试');
						});
				});
			}
		},

		showLog() {
			this.drawer = false;
			this.log_show = !this.log_show;
		},
		speedLife() {
			uni.showModal({
				title: '提示',
				content: '看一个广告就可以体验时光穿梭',
				success: e => {
					if (e.confirm) {
						this.lookVideo(3);
					}
				},
			});
		},
		//破解版
		pj(do_now = false) {
			if (!do_now) {
				this.lookVideo(4);
				return;
			}
			// this.toast('今日下午更新，敬请期待！');
			// return;
			//修仙版
			this.pools = [
				{
					desc: '跳过你的60~90岁',
					grade: 3,
					id: 1114,
					name: '橙色胶囊',
					// selected: true,
				},
				{
					desc: '所有属性+2',
					grade: 3,
					id: 1023,
					name: '半神',
					// selected: true,
				},
				{
					desc: '100岁时才能开启',
					grade: 3,
					id: 1048,
					name: '神秘的小盒子',
					// selected: true,
				},
				{
					desc: '死后可能灵魂离体',
					grade: 3,
					id: 1135,
					name: '轮回之外',
					// selected: true,
				},
				{
					desc: '一百岁时所有属性+10',
					grade: 3,
					id: 1137,
					name: '百岁丸',
					// selected: true,
				},
				{
					desc: '随机属性+8',
					grade: 3,
					id: 1141,
					name: '阴间大会员',
					// selected: true,
				},
				{
					desc: '渡劫失败重生',
					grade: 2,
					id: 1134,
					name: '转世重修',
					// selected: true,
				},
				{
					desc: '快乐>10时其他属性+3',
					grade: 2,
					id: 1083,
					name: '神谕',
					// selected: true,
				},
				{
					desc: '你可能听到一些绝密消息',
					grade: 2,
					id: 1112,
					name: '异界来客',
					// selected: true,
				},
				{
					desc: '不知道有什么用……',
					grade: 2,
					id: 1131,
					name: '魔法棒',
					// selected: true,
				},
				{
					desc: '&▓▓▓◆▓▓▓￥#▓@■.◆',
					grade: 2,
					id: 1128,
					name: '克苏鲁',
					// selected: true,
				},
				{
					desc: '可能会回到年轻的时候',
					grade: 2,
					id: 1132,
					name: '返老还童',
					// selected: true,
				},
				{
					desc: '美籍华人',
					grade: 2,
					id: 1014,
					name: '你有美国国籍',
					// selected: true,
				},
				{
					desc: '所有属性>5时，所有属性+2',
					grade: 2,
					id: 1102,
					name: '超进化',
					// selected: true,
				},
				{
					desc: '入宅的可能性翻6倍',
					grade: 2,
					id: 1005,
					name: '动漫高手',
					// selected: true,
				},
				{
					desc: '家境+5',
					grade: 2,
					id: 1136,
					name: '贪婪',
					// selected: true,
				},
				{
					desc: '功能不明',
					grade: 1,
					id: 1065,
					name: '祖传药丸',
					// selected: true,
				},

				{
					desc: '性别一定为女',
					grade: 1,
					id: 1004,
					name: '生而为女',
					// selected: true,
				},
				{
					desc: '性别一定为男',
					grade: 1,
					id: 1003,
					name: '生而为男',
					// selected: true,
				},
				{
					desc: '或许时间会倒流',
					grade: 0,
					id: 1133,
					name: '时光倒流',
					// selected: true,
				},
				{
					desc: '小时候死亡率降低',
					grade: 0,
					id: 1002,
					name: '红肚兜',
					// selected: true,
				},
				{
					desc: '或许有护佑作用',
					grade: 0,
					id: 1001,
					name: '随身玉佩',
					// selected: true,
				},
				{
					desc: '可能和同性交往',
					grade: 0,
					id: 1026,
					name: '彩虹之下',
					// selected: true,
				},
			];
			this.pools_is_pj = true;
			this.TS_NUM = 10;
			this.pro_dot_num_max = 40;
			this.toast('已自动刷新最有利于修仙的天赋');
		},

		goGlXx(type) {
			uni.navigateTo({
				url: '../article/article?type=' + type,
			});
		},
		goRank() {
			uni.navigateTo({
				url: '../rank/rank?userid=' + this.auth.id,
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
		goMini() {
			wx.navigateToMiniProgram({
				appId: 'wx52625a11b4748093',
				// path: 'page/index/index',
				extraData: {
					// foo: 'bar'
				},
				// envVersion: 'develop',
				success(res) {
					// 打开成功
				},
			});
		},
	},
};
</script>

<style lang="scss">
.content {
	background-color: #222831;
	color: #eeeeee;
}
.main {
	align-content: center;
	width: 100%;
	height: 100vh;
	position: relative;
	background-color: #222831;
	color: #eeeeee;
}
.head {
	position: fixed;
	font-size: 46rpx;
	top: calc(var(--padding-top) + 10rpx);
	left: 50%;
	white-space: nowrap;
	transform: translateX(-50%);
	text-align: center;
	color: #eeeeee;
}
#rank {
	position: fixed;
	top: calc(var(--padding-top) + 40rpx);
	left: 1rem;
	padding: 3rpx 30rpx;
	border: none;
	border-radius: 0.2rem;
	background-color: lightsteelblue;
	font-size: 27rpx;
	color: #fff;
	cursor: pointer;
	z-index: 2;
}
#title {
	position: fixed;
	font-size: 80rpx;
	font-weight: 700;
	top: 37%;
	left: 50%;
	white-space: nowrap;
	transform: translate(-50%, -50%);
	text-align: center;
	color: #eeeeee;
}
.mainbtn {
	position: fixed;
	top: 67%;
	left: 50%;
	padding: 0rpx 60rpx;
	border: 1px #eeeeee solid;
	border-radius: 10rpx;
	background-color: #393e46;
	font-size: 36rpx;
	white-space: nowrap;
	transform: translate(-50%, -50%);
	cursor: pointer;
	z-index: 2;
	color: #eeeeee;
}

.judge,
.propinitial,
.selectlist {
	position: fixed;
	list-style-type: none;
	left: 50%;
	top: calc(var(--padding-top) + 8vh);
	bottom: 3.5rem;
	width: 30rem;
	max-width: calc(100% - 2rem);
	margin: auto;
	padding: 0;
	overflow: auto;
	transform: translateX(-50%);
	text-align: center;
}
.selectlist > li {
	position: relative;
	border: 1rpx #eeeeee solid;
	display: inline-block;
	width: 95%;
	margin: 10rpx auto;
	padding: 8rpx 0;
	font-size: 34rpx;
	text-align: center;
	border-radius: 0.2rem;
	cursor: pointer;
	color: #eeeeee;
	-webkit-user-select: none;
	user-select: none;
}
.grade0b {
	background-color: #464646;
	border: #f8f8f8 2px solid !important;
}
.grade1b {
	background-color: #6495ed;
	border: #f8f8f8 2px solid !important;
}
.grade2b {
	background-color: #e2a7ff;
	border: #f8f8f8 2px solid !important;
}
.grade3b {
	background-color: #ffa07a;
	border: #f8f8f8 2px solid !important;
}
.selected {
	background-color: #c0c0c0 !important;
	box-shadow: #ccc 0px 0px 10px;
	color: #3b3b3b !important;
}

.iconc {
	border: 1rpx solid #eeeeee;
	text-align: center;
	width: 96rpx;
	line-height: 60rpx;
	height: 60rpx;
	display: block;
	font-size: 52rpx;
	font-weight: 600;
}
.propinitial li {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin: 50rpx 0;
	font-size: 40rpx;
}

.lifeProperty {
	position: fixed;
	list-style-type: none;
	left: 50%;
	top: calc(var(--padding-top) + 80rpx);
	width: 99%;
	padding: 0;
	overflow: auto;
	transform: translateX(-50%);
	display: flex;
	color: white;
	z-index: 999;
}
.lifeProperty > li {
	width: 100%;
	position: relative;
	border: 1px #ccc solid;
	display: inline-block;
	margin: 0.1rem 2px;
	font-size: 28rpx;
	text-align: center;
	border-radius: 0.2rem;
}
.lifeTrajectory {
	padding-bottom: 160rpx;
	background-color: #393e46;
	margin: 100rpx auto 0;
	width: 100%;
	min-height: 85vh;
	text-align: center;
	padding: 14rpx;
	margin-top: 200rpx;
	display: inline-table;
	box-sizing: border-box;
	margin-top: 15vh;
}
.judge > li,
.lifeTrajectory > li {
	position: relative;
	font-size: 36rpx;
	background-color: #4a5361;
	box-shadow: #eeeeee 0 0 0.4rem;
	color: #eeeeee;
	padding: 10rpx 0;
	text-align: center;
	white-space: pre-wrap;
	margin-bottom: 20rpx;
}
// .judge > li > span,
// .lifeTrajectory > li > span {
// 	position: absolute;
// 	left: 0;
// 	width: 6rem;
// 	text-align: right;
// }
.lifeTrajectoryBox-placeholder {
	height: 380rpx;
}

.main-4-top {
	height: calc(var(--padding-top) + 146rpx);
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 999;
	background-color: #222831;
}

.propinitial,
.selectlist {
	list-style: none;
	flex: 1;
	padding: 1rem;
	overflow: auto;
	padding-bottom: 200rpx;
}

.judge > li > span:nth-child(1),
.lifeTrajectory > li > span:nth-child(1) {
	width: 5rem;
	text-align: right;
}
.judge > li > span:nth-child(2),
.lifeTrajectory > li > span:nth-child(2) {
	flex: 1;
	text-align: left;
}

.judge {
	list-style: none;
	flex: 1;
	display: flex;
	flex-direction: column;
	border: 1px solid #eeeeee;
	border-radius: 4px;
	overflow: scroll;
	height: 50%;
	margin-top: 0;
}

.judge > li {
	flex: 1;
	display: flex;
	align-items: center;
	background-color: #4a5361;
	border-bottom: 1px solid #eeeeee;
	box-shadow: none;
	color: #eeeeee;
}

.judge > li:last-child {
	border-bottom: 0;
}

.judge > li.grade1 span,
.judge > li.grade1 {
	background-color: #87cefa;
	color: #4a5361;
}

.judge > li.grade2 span,
.judge > li.grade2 {
	background-color: #e7beff;
	color: #4a5361;
}

.judge > li.grade3 span,
.judge > li.grade3 {
	background-color: #f7a989;
	color: #4a5361;
}

.official {
	position: fixed;
	width: 100%;
	bottom: 36rpx;
}

//广告
.adContainer {
	width: 80%;
	position: fixed;
	bottom: 20px;
	width: 100%;
}

.logs {
	white-space: break-spaces;
	color: #333;
	text-align: left;
	padding: 30rpx 40rpx 180rpx 40rpx;
	overflow: auto;
	font-size: 30rpx;
	height: 100%;
}

.copyright {
	position: fixed;
	text-align: center;
	width: 100%;
	bottom: 10rpx;
	font-size: 22rpx;
	color: #333;
	color: #fff;
}
</style>
