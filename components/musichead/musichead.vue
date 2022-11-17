<template>
	<view class="music_head" :style="{color:color}">
		<view class="music_icon" v-if="icon" :class="{music_icon_style:iconStyle}">
			<text class="iconfont iconzuojiantou-copy" @click="goback"></text> | 
			<text class="iconfont iconshouye" @click="gotohome"></text>
		</view>
		<text class="title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props:['title','icon','color','iconStyle'],
		methods:{
			// 返回上一页
			goback(){
				uni.navigateBack()
			},
			// 返回首页
			gotohome(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.music_head{
	width: 100%;
	height: 75px;
	position: relative;
	text-align: center;
	.music_icon{
		position: absolute;
		top: 26px;
		left: 8px;
		width: 90px;
		height: 30px;
		background:rgba(0,0,0,0.4);
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
		line-height: 30px;
	}
	.music_icon_style{
		background: #fff;
		border: #ccc 1px solid;
		
	}
	.title{
		font-size: 16px;
		line-height: 80px;
	}
}
</style>