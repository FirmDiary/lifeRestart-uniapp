console.log(`环境:${process.env.NODE_ENV}`);

let host;
let environment = process.env.NODE_ENV;
if (environment === 'development') {
	// host = 'http://127.0.0.1:5000/'
	host = 'https://liferestart2.zwww.cool/'
} else {
	host = 'https://liferestart2.zwww.cool/'
}

const config = {
	version:'v1.4.3',
	host,
	auto_time:1300,
	environment, //环境
	
	app:1,
	
	ad: {
		// video_box:"adunit-08a5908913daea03",
		// video_reward:"adunit-3d299e1d4f06735b",
		
		
		video_box:"adunit-3ea0e8f992a8a17e",
		video_reward:"adunit-fe37ecf34a5acfe8",
	},
	
	log:`
预告
1.好友圈
2.个性设置
3.贴图动画
4.里程碑

日志v1.4.3
1.新增优化天赋
2.新增与优化很多事件
3.修仙版新增可选项

日志v1.4.2
1.新增趣味榜
2.新增个人昵称头像获取
3.新增人生簿
4.2倍速人生

日志v1.4.1
1.新增优化天赋
2.新增与优化很多事件
3.修改显示界面

日志v1.4.0
1.个人统计
2.排行榜
3.新版菜单
4.去除部分广告
5.人生可手动可自动可加速
6.优化天赋(关于修仙)
7.新增与优化很多事件(关于修仙)

日志v1.3.0
1.优化天赋(关于修仙)
2.新增与优化很多事件(关于修仙)
3.彩蛋:最高年龄501岁，怎么可以到达呢？
4.修仙版优化，提供15个最有利于优先的天赋，玩家可以自选10个，个人属性全部自动拉满
5.广告优化，部分看广告变成分享任务，成功分享可以完成任务
6.新增修仙攻略
	
欢迎点击【意见反馈】
留言你想要的功能哦!
`
};

export default config;
