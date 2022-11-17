<template>
	<view class="index">
		<musichead title='网易云音乐' :icon='false'></musichead>
		<view class="container">
			<scroll-view scroll-y>
				<view class="search" @click="gotoSearch">
					<text class="iconfont iconsearch"></text>
					<input type="text" placeholder="请搜索歌曲">
				</view>
				<view class="list" v-for="item in list" :key="item.id" @click="gotolist(item.listId)">
					<view class="img">
						<img :src="item.coverImgUrl" >
						<text>{{item.updateFrequency}}</text>
					</view>
					<view class="text">
						<view v-for="(item,index) in item.tracks">{{index + 1}}.{{item.first}}-{{item.second}}</view>
					</view>
				</view>
			</scroll-view>
			
		</view>
	</view>
</template>

<script>
	// 引入api
	import {topList} from '@/common/api.js'
	import musichead from '@/components/musichead/musichead.vue'
	export default {
		data() {
			return {
				list:[]
			}
		},
		components:{
			musichead
		},
		onLoad() {
			// 获取音乐列表数据
		// 	uni.request({
		// 		url:'http://localhost:3000/toplist/detail',
		// 		success:(res)=> {
		// 			console.log(res)
		// 				this.list = res.data.list
					
		// 		}
		// 	})
			topList().then(res=>{
				// console.log(res)
				if(res.length == 4){
					this.list = res
				}
			})
		},
			
		
		methods: {
			// 跳转到列表页
			gotolist(listId){
				uni.navigateTo({
					url:'/pages/list/list?listId=' + listId
				})
			},
			// 跳到搜索页
			gotoSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			}
			
		}
	}
</script>

<style lang="scss">
.index{
	.search{
		display: flex;
		height: 70rpx;
		line-height: 70rpx;
		background: #f7f7f7;
		border-radius: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		text{
			margin: 0 26rpx 0 26rpx;
			font-size: 26rpx;
		}
		input{
			flex: 1;
			font-size: 28rpx;
			margin-top: 12rpx;
		}
	}
	.list{
		margin: 0 30rpx;
		display: flex;
		margin-bottom: 34rpx;
		.img{
			width: 212rpx;
			height: 212rpx;
			position: relative;
			overflow: hidden;
			border-radius: 36rpx;
			// margin-right: 30rpx;
				img{
					width: 100%;
					height: 100%;
				}
				text{
					position: absolute;
					left: 12rpx;
					bottom: 16rpx;
					font-size: 20rpx;
					color: #fff;
				}
		}
		.text{
			flex: 1;
			view{
				font-size: 24rpx;
				line-height: 60rpx;
				margin-left: 30rpx;
			}
		}
	}
}
	
</style>
