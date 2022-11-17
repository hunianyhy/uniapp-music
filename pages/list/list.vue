<template>
	<view class="list" v-show="isLoading" >
		<view class="fixbg" :style="{'background-image':'url('+playList.coverImgUrl+')'}"></view>
		<musichead title='歌单' :icon='true' color='white'></musichead>
		<view class="container" >
			<scroll-view scroll-y>
				<view class="list-item">
					<view class="img">
						<img :src="playList.coverImgUrl">
						<text class="iconfont iconyousanjiao">{{playList.playCount | formatcount}}</text>
					</view>
					<view class="text">
						<view>{{playList.name}}</view>
						<view class="top">
							<img :src="playList.creator.avatarUrl">
							<text>网易云音乐</text>
						</view>
						<view>{{playList.description}}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="share" open-type="share">
						<text class="iconfont iconicon-"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<view class="music">
					<view class="music-top">
						<text class="iconfont iconbofang1"></text>
						<text>播放全部</text>
						<text>(共{{playList.trackCount}}首)</text>
					</view>
					<view class="music-buttom" v-for="(item,index) in playList.tracks" :key="item.id" @click="goToDetail(item.id)">
						<view class="left">{{index+1}}</view>
						<view class="middle">
							<view class="song">{{item.name}}</view>
							<view class="name">
								<img src="@/static/sq.png">
								<img src="@/static/dujia.png">
								<text>{{item.ar[0].name}}-{{item.name}}</text>
							</view>
						</view>
						<view class="iconfont iconbofang right">
						</view>
					</view>
				</view>
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '@/components/musichead/musichead.vue'
	export default {
		data() {
			return {
				playList:{
					creator:{
						avatarUrl:''
					}
				},
				isLoading:false
			}
		},
		components:{
			musichead
		},
		onLoad(options) {
			// console.log(options.listId)
			// 接收参数，并传递给gettoplist()
			this.gettoplist(options.listId)
		},
		methods: {
			// 获取头部数据
			async gettoplist(listId){
				let res = await this.$myRequest({
					url:'/playlist/detail?id='+listId
				})
				// console.log(res.data)
				// console.log(this.playList)
				this.playList = res.data.playlist
				this.isLoading = true
			},
			// 跳转到详情页
			goToDetail(songId){
				uni.navigateTo({
					url: '/pages/detail/detail?songId='+songId,
				});
			}
		}
		
	}
</script>

<style scoped lang="scss">
.list{
	.list-item{
		display: flex;
		margin: 30rpx;
		.img{
			width: 264rpx;
			height: 264rpx;
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;
			margin-right: 40rpx;
			img{
				width: 100%;
				height: 100%;
			}
			text{
				position: absolute;
				top: 8rpx;
				right: 20rpx;
				color: #fff;
				font-size: 26rpx;
			}
		}
		.text{
			flex: 1;
			color: #f0f2f7;
			view:nth-child(1){
				font-size: 34rpx;
				color: #fff;
			}
			.top{
				display: flex;
				font-size: 24rpx;
				margin: 20rpx 0;
				img{
					width: 54rpx;
					height: 54rpx;
					border-radius: 50%;
					margin-right: 14rpx;
				}
				text{
					margin-top: 10rpx;
				}
				
			}
			view:nth-child(3){
				font-size: 22rpx;
				line-height: 34rpx;
			}
		}
			
	}
	.share{
		width: 330rpx;
		height: 74rpx;
		line-height: 74rpx;
		background: rgba(0,0,0,.4);
		margin: 20rpx auto;
		border-radius: 37rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		text{
			margin-right: 20rpx;
		}
	}
	.music{
		width: 100%;
		background: #fff;
		border-radius: 40rpx;
		margin-top: 40rpx;
		overflow: hidden;
		.music-top{
			height: 50rpx;
			// background-color: skyblue;
			margin: 30rpx 0 70rpx 22rpx;
			text:nth-child(1){
				height: 50rpx;
				// width: 50rpx;
				line-height: 50rpx;
				font-size: 50rpx;
			}
			text:nth-child(2){
				font-size: 30rpx;
				margin: 0 10rpx 0 26rpx;
			}
			text:nth-child(3){
				font-size: 26rpx;
				color: #b2b2b2;
			}
		}
		.music-buttom{
			// width: 100%;
			display: flex;
			// background-color: skyblue;
			margin: 0 32rpx 66rpx 26rpx;
			// height: 58rpx;
			.left{
				font-size: 30rpx;
				width: 58rpx;
				height: 58rpx;
				line-height: 58rpx;
				text-align: center;
				color: #c7c7c7;
				
			}
			.middle{
				.song{
					text-overflow: ellipsis;
					overflow: hidden;
					width: 70vw;
					white-space: nowrap;
				}
				flex: 1;
				margin-left: 14rpx;
				.name{
					margin-top: 10rpx;
					display: flex;
					font-size: 20rpx;
					img{
						width: 32rpx;
						height: 20rpx;
						margin-right: 10rpx;
					}
					text{
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						width: 60vw;
						// margin-bottom: 5rpx;
						color: #c7c7c7;
						line-height: 20rpx;
					}
				}
			}
			.right{
				font-size: 60rpx;
				color: #c7c7c7;
				line-height: 68rpx;
			}
		}
	}
}
</style>
