<template>
	<view><web-view v-if="show" :src="link"></web-view></view>
</template>

<script>
import config from '@/conifg.js';
const HOST = config.host;
export default {
	data() {
		return {
			show: false,
			link: '',
		};
	},
	onLoad(option) {
		uni.request({
			url: `${HOST}info/article/${+(option.type || 1)}`,
			method: 'GET',
			success: res => {
				this.link = res.data;
				this.show = true;
			},
		});
	},
};
</script>

<style></style>
