<template>
	<view class="detail">
		<view class="fixbg" :style="{'background-image':'url('+songs.al.picUrl+')'}"></view>
		<musichead :title='songs.name' :icon='true' color='white'></musichead>
		<view class="container" >
			<scroll-view scroll-y>
				<!-- 播放图片 -->
				<view class="play" @click="playOrPause">
					<img :src="songs.al.picUrl" :class="{'play-run': isPlayRotate}">
					<text class="iconfont" :class="iconPlay"></text>
					<view></view>
				</view>
				<!-- 歌词 -->
				<view class="lyric">
					<view class="lyric-wrap" :style="{ transform : 'translateY('+ - (lyricIndex -1) * 82 +'rpx)' }">
						<view class="lyric-item" 
						:class="{active: lyricIndex==index}" 
						v-for="(item,index) in songLyric" 
						:key="index">
						{{item.lyric}}
						</view>
					</view>
				</view>
				<!-- 猜你喜欢 -->
				<view class="like">
					<view class="like-top">喜欢这首歌的人也听</view>
					<view class="like-buttom" v-for="item in songSimi" :key="item.id">
						<view class="img">
							<img :src="item.album.picUrl">
						</view>
						<view class="middle">
							<view>{{item.name}}</view>
							<view>
								<img v-if="item.privilege.flag > 60 && item.privilege.flag < 70 " src="/static/dujia.png">
								<img v-if="item.privilege.maxbr == 999000 " src="/static/sq.png">
								<text>{{item.album.artists[0].name}}-{{item.name}}</text>
							</view>
						</view>
						<text class="iconfont" :class="iconPlay"></text>
					</view>
				</view>
				<!-- 评论 -->
				<view class="comment">
					<view class="comment-top">精彩评论</view>
					<view class="comment-buttom" v-for="(item,index) in songComment" :key="index">
						<view class="img">
							<img :src="item.user.avatarUrl">
						</view>
						<view class="right">
							<view class="right-top">
								<view class="left">
									<view>{{item.user.nickname}}</view>
									<view>{{item.time | formattime}}</view>
								</view>
								<view class="right-right">{{item.likedCount | formatcount}} <text class="iconfont iconlike"></text> </view>
							</view>
							<view class="right-buttom">{{item.content}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 引入头部组件
	import musichead from '@/components/musichead/musichead.vue'
	export default {
		data() {
			return {
				songs:{
					al:{
					}
				},
				songSimi:[],
				songComment:[],
				songLyric:[],
				lyricIndex :0,
				iconPlay : 'iconpause',
				isPlayRotate : true,
				
				
			}
		},
		onUnload() {
			this.cancelLyricIndex()
		},
		onHide() {
			this.cancelLyricIndex()
		},
		components:{
			musichead
		},
		onLoad(options) {
			// console.log(options.songId)
			this.getMusic(options.songId)
			this.getSimiSong(options.songId)
			this.getCommentMusic(options.songId)
			this.getLyric(options.songId)
			this.getSongUrl(options.songId)
			
		},
		methods:{
			// 获取音乐信息数据	http://localhost:3000/song/detail?ids=1992034569
			async getMusic(songId){
				let res = await this.$myRequest({
					url:'/song/detail?ids='+songId
				})
				// console.log(res)
				this.songs = res.data.songs[0]
				
			},
			// 跳转到详情页，跳自己，并传递id
			
			// 获取相似歌曲数据	http://localhost:3000/simi/song?id=1992034569
			async getSimiSong(songId){
				let res = await this.$myRequest({
					url:'/simi/song?id='+songId
				})
				// console.log(res)
				this.songSimi = res.data.songs
			},
			// 获取评论数据 	http://localhost:3000/comment/music?id=1992034569
			async getCommentMusic(songId){
				let res = await this.$myRequest({
					url:'/comment/music?id='+ songId
				})
				// console.log(res)
				this.songComment = res.data.hotComments
			},
			// 获取歌词数据	http://localhost:3000/lyric?id=
			async getLyric(songId){
					let res = await this.$myRequest({
						url:'/lyric?id='+ songId
					})
					// console.log(res.data.lrc.lyric)
					let re = /\[([^\]]+)\]([^\[]+)/g;
					var result = [];
					res.data.lrc.lyric.replace(re, ($0,$1,$2)=>{
						result.push({ "time" : this.formatTimeToSec($1) , "lyric" : $2 });
					});
					this.songLyric = result;
					// console.log(result)
					
				},
				// 
			formatTimeToSec(value){
					let arr = value.split(':');
					return (Number(arr[0]*60) +  Number(arr[1])).toFixed(1);
				},
			// 获取音频播放	http://localhost:3000/song/url?id=1992034569
			async getSongUrl(songId){
				let res = await this.$myRequest({
					url:'/song/url?id='+ songId
				})
				// console.log(res)
				this.bgAudioManager = uni.getBackgroundAudioManager();
				this.bgAudioManager.title = this.songs.name;
				this.bgAudioManager.src = res.data.data[0].url || ''
				this.listenLyricIndex()
				// console.log(this.bgAudioManager)
				this.bgAudioManager.onPlay(()=>{
					this.iconPlay = 'iconpause'
					this.isPlayRotate = true
					this.listenLyricIndex()
				})
				this.bgAudioManager.onPause(()=>{
					this.iconPlay = 'iconbofang1'
					this.isPlayRotate = false
					this.cancelLyricIndex()
				})
				
			},
			// 控制播放与暂停
			playOrPause(){
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play()
				}else{
					this.bgAudioManager.pause()
				}
			},
			// 定时器监听歌词滚动
			listenLyricIndex(){
				clearInterval(this.timer);
				this.timer = setInterval(()=>{
					for(var i=0;i<this.songLyric.length;i++){
						if( this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length-1].time ){
							this.lyricIndex = this.songLyric.length-1;
							break;
						}
						if( this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i+1].time ){
							this.lyricIndex = i;
						}
					}
				},500);
			},
			// 清除定时器
			cancelLyricIndex(){
				clearInterval(this.timer);
			},
		}
	}
</script>

<style lang="scss">
.play{
	width: 580rpx;
	height: 580rpx;
	margin: 214rpx auto 0 auto;
	position: relative;
	background: url(~@/static/disc.png);
	background-size: cover;
	img{
		// 添加旋转动画
		animation: 10s linear move infinite; 
		animation-play-state: paused;
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}
	.play-run{ animation-play-state: running;}
	
	@keyframes move{
		from{ transform: rotate(0deg);}
		to{ transform : rotate(360deg);}
	}
	text{
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		color: #fff;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}
	view{
		width: 230rpx;
		height: 360rpx;
		position: absolute;
		top: -200rpx;
		left: 100rpx;
		right: 0;
		margin: auto;
		background-size: cover;
		background-image: url('/static/needle.png');
	}
}
.lyric{
	font-size: 32rpx;
	line-height: 82rpx;
	height: 246rpx;
	text-align: center;
	overflow: hidden;
	color: #666;
	.lyric-wrap{
		transition: .5s;
		.lyric-item{
			height: 82rpx;
		}
		.lyric-item.active{
			color: #fff;
		}
	}
}
.like{
	margin: 0 30rpx;
	.like-top{
		font-size: 36rpx;
		color: #fff;
		margin: 50rpx 0;
		
	}
	.like-buttom{
		display: flex;
		margin-bottom: 20rpx;
		.img{
			width: 82rpx;
			height: 82rpx;
			background-color: skyblue;
			border-radius: 20rpx;
			margin-right: 20rpx;
			overflow: hidden;
			img{
				width: 100%;
				height: 100%;
				background-color: skyblue;
			}
		}
		.middle{
			flex: 1;
			color: #c6c2bf;
			view:nth-child(1){
				font-size: 28rpx;
				color: #fff;
				// margin-bottom: 8rpx;
			}
			view:nth-child(2){
				font-size: 22rpx;
				img{
					width: 26rpx;
					height: 20rpx;
					margin-right: 10px;
				}
				text{
					// color: #c6c2bf;
					font-size: 22rpx;
				}
			}
		}
		text{
			font-size: 50rpx;
			color: #c6c2bf;
			line-height: 50rpx;
			margin-top: 15rpx;
		}
	}
}
.comment{
	margin: 0 30rpx;
	.comment-top{
		font-size: 36rpx;
		color: #fff;
		margin: 50rpx 0;
		
	}
	.comment-buttom{
		margin-bottom: 28rpx;
		display: flex;
		.img{
			width:64rpx;
			height:64rpx;
			border-radius:50%;
			overflow: hidden;
			margin-right: 18rpx;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.right{
			flex: 1;
			color: #cbcacf;
			.right-top{
				display: flex;
				justify-content: space-between;
				.left{
					view:nth-child(1){
						font-size: 26rpx;
					}
					view:nth-child(2){
						font-size: 20rpx;
					}
				}
				.right-right{
					font-size: 28rpx;
				}
			}
			.right-buttom{
				font-size: 28rpx;
				line-height: 40rpx;
				color: #fff;
				margin-top: 20rpx;
				border-bottom: #eee 1px solid;
				padding-bottom: 40rpx;
			}
		}
	}
}
</style>
